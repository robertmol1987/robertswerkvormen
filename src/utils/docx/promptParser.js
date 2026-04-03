/**
 * Parses the raw text sections from the docx into structured prompt data.
 *
 * The preamble section (level 0, title "__preamble__") contains all content
 * before the first heading: rules, chatbot list, and introduction page.
 *
 * Then each H1 heading is a prompt with [SECTION], [CATEGORIES], [TAGS], [TAALMODEL], [PROMPT]
 */

export function parsePromptLibrary(sections) {
  if (!sections || sections.length === 0) return null;

  const result = {
    chatbots: [],
    introduction: null,
    overDeAuteur: null,
    sectionOrder: [],
    prompts: [],
    allCategories: new Set(),
    allChatbotModels: new Set(),
  };

  // Step 1: Find and parse the preamble section (level 0, title "__preamble__")
  // All rules, chatbots, and intro text are in this section
  const preamble = sections.find((s) => s.title === "__preamble__");

  if (preamble && preamble.content) {
    parsePreamble(preamble, result);
  }

  // Step 2: Parse all H1 sections as prompts
  for (const section of sections) {
    if (section.title === "__preamble__") continue;
    if (section.level !== 1) continue;

    const prompt = parsePromptSection(section);
    if (prompt) {
      result.prompts.push(prompt);
      for (const cat of prompt.categories) {
        result.allCategories.add(cat);
      }
      if (prompt.taalmodel) {
        result.allChatbotModels.add(prompt.taalmodel);
      }
    }
  }

  // Convert categories to sorted array with "Alle prompts" first
  const sortedCategories = Array.from(result.allCategories).sort((a, b) =>
    a.localeCompare(b, "nl"),
  );
  result.allCategories = ["Alle prompts", ...sortedCategories];

  // Convert chatbot models to sorted array
  const sortedModels = Array.from(result.allChatbotModels).sort((a, b) =>
    a.localeCompare(b, "nl"),
  );
  result.allChatbotModels = sortedModels;

  return result;
}

/**
 * Parse the preamble section which contains all pre-heading content:
 * - [Rules] with section order and chatbot list
 * - [Introduction page] with welcome content
 */
function parsePreamble(preamble, result) {
  const items = preamble.content;

  let phase = "before-start";
  const introContentItems = [];
  const overDeAuteurItems = [];
  const rulesLines = [];
  const chatbotLines = [];
  let inChatbots = false;

  for (const item of items) {
    const itemText = getItemText(item);

    if (itemText.includes("[Start loading here]")) {
      phase = "start";
      continue;
    }

    if (itemText.includes("[Rules]") || phase === "start") {
      phase = "rules";
      if (itemText.includes("[Rules]")) continue;
    }

    if (itemText.includes("[List of chatbots]")) {
      inChatbots = true;
      continue;
    }

    if (itemText.includes("[End of list of chatbots]")) {
      inChatbots = false;
      continue;
    }

    if (itemText.includes("[End of rules]")) {
      phase = "after-rules";
      inChatbots = false;
      continue;
    }

    if (itemText.includes("[Introduction page]")) {
      phase = "intro";
      continue;
    }

    if (
      itemText.includes("[End of introduction page]") ||
      itemText.includes("[End of  introduction  page]")
    ) {
      phase = "after-intro";
      continue;
    }

    if (itemText.includes("[Over de auteur]")) {
      phase = "auteur";
      continue;
    }

    if (itemText.includes("[Einde over de auteur]")) {
      phase = "after-auteur";
      continue;
    }

    if (phase === "before-start") continue;

    if (inChatbots) {
      chatbotLines.push(itemText);
    } else if (phase === "rules") {
      rulesLines.push(itemText);
    } else if (phase === "intro") {
      introContentItems.push(item);
    } else if (phase === "auteur") {
      overDeAuteurItems.push(item);
    }
  }

  // Parse rules (section order)
  const rulesText = rulesLines.join("\n");
  const sectionMatch = rulesText.match(
    /Dit zijn de \[Sections\].*?:\s*([\s\S]*)/i,
  );
  if (sectionMatch) {
    result.sectionOrder = sectionMatch[1]
      .trim()
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // Parse chatbots
  for (const line of chatbotLines) {
    const cleaned = line.replace(/^[-•*]\s*/, "").trim();
    if (!cleaned) continue;
    const semicolonIdx = cleaned.indexOf(";");
    if (semicolonIdx > 0) {
      const name = cleaned.substring(0, semicolonIdx).trim();
      const url = cleaned.substring(semicolonIdx + 1).trim();
      if (name && url) {
        result.chatbots.push({ name, url });
      }
    }
  }

  // Build introduction as a synthetic section
  if (introContentItems.length > 0) {
    result.introduction = {
      id: "section-intro",
      title: "Welkom!",
      level: 1,
      content: introContentItems,
      children: [],
    };
  }

  // Build over de auteur as a synthetic section
  if (overDeAuteurItems.length > 0) {
    result.overDeAuteur = {
      id: "section-auteur",
      title: "Over de auteur",
      level: 1,
      content: overDeAuteurItems,
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

function parsePromptSection(section) {
  if (!section.content || section.content.length === 0) return null;

  // Check if this section has prompt markers
  let hasMarkers = false;
  for (const item of section.content) {
    const t = getItemText(item);
    if (t === "[SECTION]" || t === "[PROMPT]" || t === "[CATEGORIES]") {
      hasMarkers = true;
      break;
    }
  }

  if (!hasMarkers) return null;

  const prompt = {
    name: section.title,
    section: [],
    categories: [],
    tags: [],
    taalmodel: "",
    promptText: "",
  };

  let currentMarker = null;
  const markerTexts = {
    section: [],
    categories: [],
    tags: [],
    taalmodel: [],
    prompt: [],
  };

  let afterPromptMarker = false;

  for (const item of section.content) {
    const itemText = getItemText(item);

    // Check for marker lines
    if (itemText === "[SECTION]") {
      currentMarker = "section";
      afterPromptMarker = false;
      continue;
    }
    if (itemText === "[CATEGORIES]") {
      currentMarker = "categories";
      afterPromptMarker = false;
      continue;
    }
    if (itemText === "[TAGS]") {
      currentMarker = "tags";
      afterPromptMarker = false;
      continue;
    }
    if (itemText === "[TAALMODEL]") {
      currentMarker = "taalmodel";
      afterPromptMarker = false;
      continue;
    }
    if (itemText === "[PROMPT]") {
      currentMarker = "prompt";
      afterPromptMarker = true;
      continue;
    }

    // Skip empty content unless we're collecting prompt text
    if (!itemText) {
      if (afterPromptMarker) {
        markerTexts.prompt.push("");
      }
      continue;
    }

    // Assign text to the current marker
    if (currentMarker && markerTexts[currentMarker] !== undefined) {
      markerTexts[currentMarker].push(itemText);
    }
  }

  // Process extracted marker texts
  const sectionText = markerTexts.section.join(" ").trim();
  prompt.section = sectionText
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  const categoriesText = markerTexts.categories.join(" ").trim();
  prompt.categories = categoriesText
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  const tagsText = markerTexts.tags.join(" ").trim();
  prompt.tags = tagsText
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  prompt.taalmodel = markerTexts.taalmodel.join(" ").trim();

  prompt.promptText = markerTexts.prompt.join("\n").trim();

  // The first line of the prompt text is often the same as the title, remove duplication
  const promptLines = prompt.promptText.split("\n");
  if (promptLines.length > 0 && promptLines[0].trim() === prompt.name.trim()) {
    prompt.promptText = promptLines.slice(1).join("\n").trim();
  }

  return prompt;
}
