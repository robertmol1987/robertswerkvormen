/**
 * Parses the raw text sections from the werkvormen docx into structured data.
 *
 * The document structure:
 * - Preamble with [Start loading here], [Rules], [Welkom], [Over de auteur]
 * - [Hoofdcategorie] ... [Einde hoofdcategorie] blocks define category names (H1)
 * - H2 headings are werkvorm names, followed by structured fields:
 *   [Naam van de werkvorm], [Subtitel van de werkvorm], [Categorie van de werkvorm],
 *   [Icon van de werkvorm], [URL van de werkvorm], [Doelgroep van de werkvorm],
 *   [Belangrijke informatie / dataveiligheid / Disclaimers],
 *   [Duur van de werkvorm], [Tags van de werkvorm], [Beoordeling van de werkvorm],
 *   [Doel van de werkvorm], [De werkvorm uitgelegd], [Analoog, digitaal en/of AI],
 *   [Opties voor Plaats- en tijd onafhankelijk], [Benodigdheden van de werkvorm],
 *   [Stappenplan van de werkvorm], [Variaties op de werkvorm],
 *   [Extra tips voor deze werkvorm], [Positieve punten van de werkvorm],
 *   [Minder positieve punten van de werkvorm], [Persoonlijke reactie op de werkvorm],
 *   [Einde]
 */

export function parseToolboxLibrary(sections, auteurSections) {
  if (!sections || sections.length === 0) return null;

  const result = {
    introduction: null,
    overDeAuteur: null,
    trainingen: null,
    genereerWerkvorm: null, // from [Genereer een werkvorm] ... [Einde Genereer een werkvorm]
    ookVanDezeAuteur: [],
    pageTitle: "",
    pageSubtitle: "",
    categories: [],
    categoryDescriptions: {},
    tools: [], // we keep the name "tools" internally for compatibility, but these are werkvormen
    allGoals: new Set(),
    allTags: new Set(),
    allDoelgroepen: new Set(),
    allAnaloogDigitaal: new Set(),
    allPlaatsTijd: new Set(),
  };

  // Step 1: Find and parse the preamble section
  const preamble = sections.find((s) => s.title === "__preamble__");
  if (preamble && preamble.content) {
    parsePreamble(preamble, result);
  }

  // Step 1b: Parse auteur/trainingen from the second docx (overrides main doc)
  if (auteurSections && auteurSections.length > 0) {
    const auteurPreamble = auteurSections.find(
      (s) => s.title === "__preamble__",
    );
    if (auteurPreamble && auteurPreamble.content) {
      parseAuteurPreamble(auteurPreamble, result);
    }
  }

  // Step 2: Track current category from H1 sections
  let currentCategory = null;

  for (const section of sections) {
    if (section.title === "__preamble__") continue;

    // H1 = category header
    if (section.level === 1) {
      const titleClean = section.title.trim();

      if (titleClean) {
        currentCategory = titleClean;
        if (!result.categories.includes(currentCategory)) {
          result.categories.push(currentCategory);
        }

        // Parse category description from section content
        if (section.content && section.content.length > 0) {
          let inDescription = false;
          const descLines = [];

          for (const item of section.content) {
            const itemText = getItemText(item);
            const itemTextLower = itemText
              .toLowerCase()
              .replace(/\s+/g, " ")
              .trim();

            if (itemTextLower.includes("[beschrijving hoofdcategorie]")) {
              inDescription = true;
              continue;
            }
            if (
              itemTextLower.includes("[einde beschrijving hoofdcategorie]") ||
              itemTextLower.includes("[einde hoofdcategorie]")
            ) {
              inDescription = false;
              continue;
            }

            if (inDescription && itemText) {
              descLines.push(itemText);
            }
          }

          if (descLines.length > 0) {
            result.categoryDescriptions[currentCategory] = descLines.join("\n");
          }
        }
      }
      continue;
    }

    // H2 = werkvorm entry
    if (section.level === 2) {
      const werkvorm = parseWerkvormSection(section, currentCategory);
      if (werkvorm) {
        // The werkvorm has its own category field from [Categorie van de werkvorm]
        // which can contain multiple categories separated by comma
        result.tools.push(werkvorm);
        if (werkvorm.goals && werkvorm.goals.length > 0) {
          for (const goal of werkvorm.goals) {
            result.allGoals.add(goal);
          }
        }
        if (werkvorm.tags && werkvorm.tags.length > 0) {
          for (const tag of werkvorm.tags) {
            result.allTags.add(tag);
          }
        }
        if (werkvorm.doelgroepen && werkvorm.doelgroepen.length > 0) {
          for (const dg of werkvorm.doelgroepen) {
            result.allDoelgroepen.add(dg);
          }
        }
        if (werkvorm.analoogDigitaal && werkvorm.analoogDigitaal.length > 0) {
          for (const ad of werkvorm.analoogDigitaal) {
            result.allAnaloogDigitaal.add(ad);
          }
        }
        if (werkvorm.plaatsTijd && werkvorm.plaatsTijd.length > 0) {
          for (const pt of werkvorm.plaatsTijd) {
            result.allPlaatsTijd.add(pt);
          }
        }
        // Collect categories from the werkvorm's own categories field
        if (werkvorm.categories && werkvorm.categories.length > 0) {
          for (const cat of werkvorm.categories) {
            if (!result.categories.includes(cat)) {
              result.categories.push(cat);
            }
          }
        }
      }
    }
  }

  // Filter out invisible werkvormen (zichtbaar === false)
  result.tools = result.tools.filter((t) => t.zichtbaar !== false);

  // Convert sets to sorted arrays
  result.allGoals = Array.from(result.allGoals).sort((a, b) =>
    a.localeCompare(b, "nl"),
  );
  result.allTags = Array.from(result.allTags).sort((a, b) =>
    a.localeCompare(b, "nl"),
  );
  result.allDoelgroepen = Array.from(result.allDoelgroepen).sort((a, b) =>
    a.localeCompare(b, "nl"),
  );
  result.allAnaloogDigitaal = Array.from(result.allAnaloogDigitaal).sort(
    (a, b) => a.localeCompare(b, "nl"),
  );
  result.allPlaatsTijd = Array.from(result.allPlaatsTijd).sort((a, b) =>
    a.localeCompare(b, "nl"),
  );

  return result;
}

function parsePreamble(preamble, result) {
  const items = preamble.content;

  let phase = "before-start";
  const welcomeItems = [];
  const overDeAuteurItems = [];
  const ookVanDezeAuteurItems = [];
  const trainingenItems = [];
  const genereerWerkvormItems = [];
  const pageTitleLines = [];
  const pageSubtitleLines = [];

  for (const item of items) {
    const itemText = getItemText(item);
    const itemTextLower = itemText.toLowerCase().replace(/\s+/g, " ").trim();

    if (itemText.includes("[Start loading here]")) {
      phase = "start";
      continue;
    }

    if (itemText.includes("[Rules]")) {
      phase = "rules";
      continue;
    }

    if (itemText.includes("[End of rules]")) {
      phase = "after-rules";
      continue;
    }

    if (itemTextLower.includes("[paginatitel]")) {
      phase = "paginatitel";
      continue;
    }

    if (itemTextLower.includes("[einde paginatitel]")) {
      phase = "after-paginatitel";
      continue;
    }

    if (itemTextLower.includes("[pagina subtitel]")) {
      phase = "pagina-subtitel";
      continue;
    }

    if (itemTextLower.includes("[einde pagina subtitel]")) {
      phase = "after-pagina-subtitel";
      continue;
    }

    if (itemText.includes("[Welkom]")) {
      phase = "welkom";
      continue;
    }

    if (itemText.includes("[Einde welkom]")) {
      phase = "after-welkom";
      continue;
    }

    if (itemText.includes("[Over de auteur]")) {
      phase = "auteur";
      continue;
    }

    if (
      itemText.includes("[Einde over de auteur]") ||
      itemText.includes("[einde over de auteur]")
    ) {
      phase = "after-auteur";
      continue;
    }

    if (itemText.includes("[Ook van deze auteur]")) {
      phase = "ook-van-auteur";
      continue;
    }

    if (
      itemText.includes("[Einde Ook van deze auteur]") ||
      itemText.includes("[Einde ook van deze auteur]") ||
      itemText.includes("[einde ook van deze auteur]")
    ) {
      phase = "after-ook-van-auteur";
      continue;
    }

    if (itemTextLower.includes("[trainingenmenu]")) {
      phase = "trainingen";
      continue;
    }

    if (itemTextLower.includes("[einde trainingenmenu]")) {
      phase = "after-trainingen";
      continue;
    }

    // Genereer een werkvorm section
    if (itemTextLower.includes("[genereer een werkvorm]")) {
      phase = "genereer-werkvorm";
      continue;
    }

    if (itemTextLower.includes("[einde genereer een werkvorm]")) {
      phase = "after-genereer-werkvorm";
      continue;
    }

    if (itemText.includes("[Hoofdcategorie]")) {
      phase = "hoofdcategorie";
      continue;
    }

    if (itemText.includes("[Einde hoofdcategorie]")) {
      phase = "after-hoofdcategorie";
      continue;
    }

    if (phase === "before-start") continue;

    if (phase === "paginatitel") {
      if (itemText) pageTitleLines.push(itemText);
    } else if (phase === "pagina-subtitel") {
      if (itemText) pageSubtitleLines.push(itemText);
    } else if (phase === "welkom") {
      welcomeItems.push(item);
    } else if (phase === "auteur") {
      overDeAuteurItems.push(item);
    } else if (phase === "trainingen") {
      trainingenItems.push(item);
    } else if (phase === "genereer-werkvorm") {
      genereerWerkvormItems.push(item);
    } else if (phase === "ook-van-auteur") {
      const fullText = getItemText(item);
      if (!fullText) continue;

      let url = "";
      if (item.parts) {
        for (const part of item.parts) {
          if (part.link && part.href) {
            url = part.href;
            break;
          }
        }
        if (!url) {
          for (const part of item.parts) {
            if (
              part.link &&
              part.text &&
              /^https?:\/\//.test(part.text.trim())
            ) {
              url = part.text.trim();
              break;
            }
          }
        }
        if (!url) {
          for (const part of item.parts) {
            if (part.text) {
              const urlMatch = part.text.match(/(https?:\/\/[^\s;,]+)/);
              if (urlMatch) {
                url = urlMatch[1];
                break;
              }
            }
          }
        }
      }

      let label = fullText;
      const dashIdx = label.indexOf(" - ");
      const dashIdx2 = label.indexOf(" – ");
      const bestDash =
        dashIdx >= 0 && dashIdx2 >= 0
          ? Math.min(dashIdx, dashIdx2)
          : dashIdx >= 0
            ? dashIdx
            : dashIdx2;
      if (bestDash >= 0) {
        label = label.substring(0, bestDash);
      }
      label = label
        .replace(/[;,\s]+$/, "")
        .replace(/^\s+/, "")
        .trim();

      if (label && url) {
        ookVanDezeAuteurItems.push({ label, url });
      }
    }
  }

  if (pageTitleLines.length > 0) {
    result.pageTitle = pageTitleLines.join(" ");
  }
  if (pageSubtitleLines.length > 0) {
    result.pageSubtitle = pageSubtitleLines.join(" ");
  }

  if (welcomeItems.length > 0) {
    result.introduction = {
      id: "section-intro",
      title: "Welkom!",
      level: 1,
      content: welcomeItems,
      children: [],
    };
  }

  if (overDeAuteurItems.length > 0) {
    result.overDeAuteur = {
      id: "section-auteur",
      title: "Over de auteur",
      level: 1,
      content: overDeAuteurItems,
      children: [],
    };
  }

  if (ookVanDezeAuteurItems.length > 0) {
    result.ookVanDezeAuteur = ookVanDezeAuteurItems;
  }

  if (trainingenItems.length > 0) {
    result.trainingen = {
      id: "section-trainingen",
      title: "Trainingen",
      level: 1,
      content: trainingenItems,
      children: [],
    };
  }

  if (genereerWerkvormItems.length > 0) {
    result.genereerWerkvorm = {
      id: "section-genereer-werkvorm",
      title: "Genereer een werkvorm",
      level: 1,
      content: genereerWerkvormItems,
      children: [],
    };
  }
}

function getItemText(item) {
  if (!item.parts) return "";
  return item.parts
    .filter((p) => p.text)
    .map((p) => p.text)
    .join("")
    .trim();
}

function getItemLink(item) {
  if (!item.parts) return "";
  for (const part of item.parts) {
    if (part.link && part.href) return part.href;
    if (part.link && part.text) return part.text;
  }
  return "";
}

function getItemImage(item) {
  if (!item.parts) return null;
  for (const part of item.parts) {
    if (part.type === "image" && part.imageName) {
      return part;
    }
  }
  return null;
}

function parseWerkvormSection(section, defaultCategory) {
  if (!section.content || section.content.length === 0) return null;

  const werkvorm = {
    name: section.title || "",
    subtitle: "",
    url: "",
    icon: null,
    category: defaultCategory || "",
    categories: [],
    rating: 0,
    description: "",
    werkvormUitgelegd: [], // array of rich content items {type, parts, listLevel}
    goals: [],
    pros: [],
    cons: [],
    tags: [],
    doelgroepen: [],
    disclaimers: "",
    duur: "",
    analoogDigitaal: [],
    plaatsTijd: [],
    benodigdheden: "",
    stappenplan: [],
    variaties: "",
    extraTips: "",
    persoonlijkeReactie: "",
    aiOndersteuning: "",
    dePrompt: "",
    dataPolicy: "",
    reactions: "",
    afbeeldingen: [], // images from [Afbeeldingen] section
    eigenaar: "", // from [Eigenaar]
    zichtbaar: true, // from [Zichtbaar] — defaults to true, set to false when 'Nee'
  };

  let currentField = null;

  // Markers (case-insensitive)
  const fieldMarkers = {
    "[naam van de werkvorm]": "name",
    "[subtitel van de werkvorm]": "subtitle",
    "[categorie van de werkvorm]": "categories",
    "[icon van de werkvorm]": "icon",
    "[url van de werkvorm]": "url",
    "[doelgroep van de werkvorm]": "doelgroepen",
    "[belangrijke informatie / dataveiligheid / disclaimers]": "disclaimers",
    "[belangrijke informatie": "disclaimers",
    "[duur van de werkvorm]": "duur",
    "[tags van de werkvorm]": "tags",
    "[beoordeling van de werkvorm]": "rating",
    "[doel van de werkvorm]": "goals",
    "[de werkvorm uitgelegd]": "werkvormUitgelegd",
    "[beschrijving van de werkvorm]": "description",
    "[analoog, digitaal en/of ai]": "analoogDigitaal",
    "[opties voor plaats- en tijd onafhankelijk]": "plaatsTijd",
    "[opties voor plaats-": "plaatsTijd",
    "[benodigdheden van de werkvorm]": "benodigdheden",
    "[stappenplan van de werkvorm]": "stappenplan",
    "[variaties op de werkvorm]": "variaties",
    "[extra tips voor deze werkvorm]": "extraTips",
    "[positieve punten van de werkvorm]": "pros",
    "[minder positieve punten van de werkvorm]": "cons",
    "[persoonlijke reactie op de werkvorm]": "persoonlijkeReactie",
    "[ai-ondersteuning]": "aiOndersteuning",
    "[de prompt]": "dePrompt",
    "[afbeeldingen]": "afbeeldingen",
    "[eigenaar]": "eigenaar",
    "[zichtbaar]": "zichtbaar",
    // backward compat
    "[naam van de tool]": "name",
    "[subtitel van de tool]": "subtitle",
    "[url van de tool]": "url",
    "[icon van de tool]": "icon",
    "[sectie van de tool]": "categories",
    "[beoordeling van de tool]": "rating",
    "[beschrijving van de tool]": "description",
    "[doel van de tool]": "goals",
    "[positieve punten van de tool]": "pros",
    "[minder positieve punten van de tool]": "cons",
    "[data verantwoording van de tool]": "disclaimers",
    "[reacties op de tool]": "persoonlijkeReactie",
    "[tags]": "tags",
  };

  for (const item of section.content) {
    const itemText = getItemText(item);
    const itemTextLower = itemText.toLowerCase().replace(/\s+/g, " ").trim();

    // [Einde] marks the end
    if (itemTextLower === "[einde]" || itemTextLower.includes("[einde]")) {
      break;
    }

    // Check if this line is a field marker
    let isMarker = false;
    for (const [marker, field] of Object.entries(fieldMarkers)) {
      const cleanMarker = marker.replace(/\s+/g, " ").trim();
      if (itemTextLower.includes(cleanMarker)) {
        currentField = field;
        isMarker = true;
        break;
      }
    }

    if (isMarker) continue;

    // Skip empty lines (except icon, werkvormUitgelegd and afbeeldingen fields which may have images)
    if (
      !itemText &&
      currentField !== "icon" &&
      currentField !== "werkvormUitgelegd" &&
      currentField !== "afbeeldingen"
    )
      continue;

    const skipPrefixes = [
      "minpunten:",
      "data verantwoording:",
      "reacties van gebruikers:",
      "pluspunten:",
    ];
    if (skipPrefixes.some((p) => itemTextLower === p)) continue;

    // Assign content to the current field
    if (currentField === "name") {
      if (itemText) werkvorm.name = itemText;
    } else if (currentField === "subtitle") {
      if (itemText) werkvorm.subtitle = itemText;
    } else if (currentField === "url") {
      if (itemText) {
        const link = getItemLink(item);
        werkvorm.url = link || itemText;
      }
    } else if (currentField === "icon") {
      const imgPart = getItemImage(item);
      if (imgPart) {
        werkvorm.icon = imgPart;
      }
    } else if (currentField === "categories") {
      if (itemText) {
        const cats = itemText
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c && c !== "-");
        werkvorm.categories.push(...cats);
        // Use first category as the main category
        if (cats.length > 0 && !werkvorm.category) {
          werkvorm.category = cats[0];
        }
      }
    } else if (currentField === "rating") {
      if (itemText) {
        const trimmed = itemText.trim();
        if (trimmed === "?") {
          werkvorm.rating = -1;
        } else {
          const num = parseInt(trimmed, 10);
          if (!isNaN(num)) werkvorm.rating = Math.min(5, Math.max(0, num));
        }
      }
    } else if (currentField === "description") {
      if (itemText) {
        werkvorm.description = werkvorm.description
          ? werkvorm.description + "\n" + itemText
          : itemText;
      }
    } else if (currentField === "werkvormUitgelegd") {
      const hasImage = getItemImage(item);
      if ((itemText && itemText !== "-") || hasImage) {
        werkvorm.werkvormUitgelegd.push(item);
      }
    } else if (currentField === "goals") {
      if (itemText) {
        const goals = itemText
          .split(",")
          .map((g) => g.trim())
          .filter((g) => g && g !== "-");
        werkvorm.goals.push(...goals);
      }
    } else if (currentField === "pros") {
      if (itemText && itemText !== "-") {
        werkvorm.pros.push(itemText);
      }
    } else if (currentField === "cons") {
      if (itemText && itemText !== "-") {
        werkvorm.cons.push(itemText);
      }
    } else if (currentField === "tags") {
      if (itemText && itemText !== "-") {
        const tags = itemText
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t && t !== "-");
        werkvorm.tags.push(...tags);
      }
    } else if (currentField === "doelgroepen") {
      if (itemText) {
        const items2 = itemText
          .split(",")
          .map((d) => d.trim())
          .filter((d) => d && d !== "-");
        werkvorm.doelgroepen.push(...items2);
      }
    } else if (currentField === "disclaimers") {
      if (itemText && itemText !== "-") {
        werkvorm.disclaimers = werkvorm.disclaimers
          ? werkvorm.disclaimers + "\n" + itemText
          : itemText;
      }
    } else if (currentField === "duur") {
      if (itemText) {
        werkvorm.duur = werkvorm.duur
          ? werkvorm.duur + " " + itemText
          : itemText;
      }
    } else if (currentField === "analoogDigitaal") {
      if (itemText) {
        const items2 = itemText
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a && a !== "-");
        werkvorm.analoogDigitaal.push(...items2);
      }
    } else if (currentField === "plaatsTijd") {
      if (itemText) {
        const items2 = itemText
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p && p !== "-");
        werkvorm.plaatsTijd.push(...items2);
      }
    } else if (currentField === "benodigdheden") {
      if (itemText && itemText !== "-") {
        werkvorm.benodigdheden = werkvorm.benodigdheden
          ? werkvorm.benodigdheden + "\n" + itemText
          : itemText;
      }
    } else if (currentField === "stappenplan") {
      if (itemText && itemText !== "-") {
        werkvorm.stappenplan.push(itemText);
      }
    } else if (currentField === "variaties") {
      if (itemText && itemText !== "-") {
        werkvorm.variaties = werkvorm.variaties
          ? werkvorm.variaties + "\n" + itemText
          : itemText;
      }
    } else if (currentField === "extraTips") {
      if (itemText && itemText !== "-") {
        werkvorm.extraTips = werkvorm.extraTips
          ? werkvorm.extraTips + "\n" + itemText
          : itemText;
      }
    } else if (currentField === "persoonlijkeReactie") {
      if (itemText && itemText !== "-") {
        werkvorm.persoonlijkeReactie = werkvorm.persoonlijkeReactie
          ? werkvorm.persoonlijkeReactie + "\n" + itemText
          : itemText;
      }
    } else if (currentField === "aiOndersteuning") {
      if (itemText && itemText !== "-") {
        werkvorm.aiOndersteuning = werkvorm.aiOndersteuning
          ? werkvorm.aiOndersteuning + "\n" + itemText
          : itemText;
      }
    } else if (currentField === "dePrompt") {
      if (itemText && itemText !== "-") {
        werkvorm.dePrompt = werkvorm.dePrompt
          ? werkvorm.dePrompt + "\n" + itemText
          : itemText;
      }
    } else if (currentField === "afbeeldingen") {
      const hasImage = getItemImage(item);
      if ((itemText && itemText !== "-") || hasImage) {
        werkvorm.afbeeldingen.push(item);
      }
    } else if (currentField === "eigenaar") {
      if (itemText && itemText !== "-") {
        werkvorm.eigenaar = werkvorm.eigenaar
          ? werkvorm.eigenaar + "\n" + itemText
          : itemText;
      }
    } else if (currentField === "zichtbaar") {
      if (itemText) {
        const val = itemText.trim().toLowerCase();
        if (val === "nee" || val === "no" || val === "false") {
          werkvorm.zichtbaar = false;
        }
      }
    }
  }

  // Clean up '-' values that mean empty
  if (werkvorm.url === "-") werkvorm.url = "";
  if (werkvorm.duur === "-") werkvorm.duur = "";
  if (werkvorm.subtitle === "-") werkvorm.subtitle = "";
  if (werkvorm.description === "-") werkvorm.description = "";
  // werkvormUitgelegd is now an array, no string cleanup needed
  if (werkvorm.benodigdheden === "-") werkvorm.benodigdheden = "";
  if (werkvorm.variaties === "-") werkvorm.variaties = "";
  if (werkvorm.extraTips === "-") werkvorm.extraTips = "";
  if (werkvorm.disclaimers === "-") werkvorm.disclaimers = "";
  if (werkvorm.persoonlijkeReactie === "-") werkvorm.persoonlijkeReactie = "";
  if (werkvorm.aiOndersteuning === "-") werkvorm.aiOndersteuning = "";
  if (werkvorm.dePrompt === "-") werkvorm.dePrompt = "";
  if (werkvorm.eigenaar === "-") werkvorm.eigenaar = "";

  return werkvorm;
}

/**
 * Parses [Over de auteur], [Ook van deze auteur], and [TrainingenMenu]
 * from the second docx file (overdeauteur-trainingsoverzicht.docx).
 * These override whatever was parsed from the main docx.
 */
function parseAuteurPreamble(preamble, result) {
  const items = preamble.content;

  let phase = "scanning";
  const overDeAuteurItems = [];
  const ookVanDezeAuteurItems = [];
  const trainingenItems = [];

  for (const item of items) {
    const itemText = getItemText(item);
    const itemTextLower = itemText.toLowerCase().replace(/\s+/g, " ").trim();

    if (itemText.includes("[Over de auteur]")) {
      phase = "auteur";
      continue;
    }
    if (
      itemText.includes("[Einde over de auteur]") ||
      itemText.includes("[einde over de auteur]")
    ) {
      phase = "scanning";
      continue;
    }
    if (itemText.includes("[Ook van deze auteur]")) {
      phase = "ook-van-auteur";
      continue;
    }
    if (
      itemText.includes("[Einde Ook van deze auteur]") ||
      itemText.includes("[Einde ook van deze auteur]") ||
      itemText.includes("[einde ook van deze auteur]")
    ) {
      phase = "scanning";
      continue;
    }
    if (itemTextLower.includes("[trainingenmenu]")) {
      phase = "trainingen";
      continue;
    }
    if (itemTextLower.includes("[einde trainingenmenu]")) {
      phase = "scanning";
      continue;
    }

    if (phase === "auteur") {
      overDeAuteurItems.push(item);
    } else if (phase === "trainingen") {
      trainingenItems.push(item);
    } else if (phase === "ook-van-auteur") {
      const fullText = getItemText(item);
      if (!fullText) continue;

      let url = "";
      if (item.parts) {
        for (const part of item.parts) {
          if (part.link && part.href) {
            url = part.href;
            break;
          }
        }
        if (!url) {
          for (const part of item.parts) {
            if (
              part.link &&
              part.text &&
              /^https?:\/\//.test(part.text.trim())
            ) {
              url = part.text.trim();
              break;
            }
          }
        }
        if (!url) {
          for (const part of item.parts) {
            if (part.text) {
              const urlMatch = part.text.match(/(https?:\/\/[^\s;,]+)/);
              if (urlMatch) {
                url = urlMatch[1];
                break;
              }
            }
          }
        }
      }

      let label = fullText;
      const dashIdx = label.indexOf(" - ");
      const dashIdx2 = label.indexOf(" – ");
      const bestDash =
        dashIdx >= 0 && dashIdx2 >= 0
          ? Math.min(dashIdx, dashIdx2)
          : dashIdx >= 0
            ? dashIdx
            : dashIdx2;
      if (bestDash >= 0) {
        label = label.substring(0, bestDash);
      }
      label = label
        .replace(/[;,\s]+$/, "")
        .replace(/^\s+/, "")
        .trim();

      if (label && url) {
        ookVanDezeAuteurItems.push({ label, url });
      }
    }
  }

  // Override the auteur data from the main docx
  if (overDeAuteurItems.length > 0) {
    result.overDeAuteur = {
      id: "section-auteur",
      title: "Over de auteur",
      level: 1,
      content: overDeAuteurItems,
      children: [],
    };
  }

  if (ookVanDezeAuteurItems.length > 0) {
    result.ookVanDezeAuteur = ookVanDezeAuteurItems;
  }

  if (trainingenItems.length > 0) {
    result.trainingen = {
      id: "section-trainingen",
      title: "Trainingen",
      level: 1,
      content: trainingenItems,
      children: [],
    };
  }
}
