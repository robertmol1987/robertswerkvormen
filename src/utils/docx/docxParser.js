import { readZipEntries, extractTextFile } from "./zipHelpers";
import { extractImages } from "./imageExtractor";
import { parseRelationships } from "./relationshipsParser";
import { parseDocumentXml } from "./xmlParser";

async function parseDocxBuffer(buffer) {
  const entries = readZipEntries(buffer);

  // Extract document.xml
  const xmlString = await extractTextFile(buffer, entries, "word/document.xml");

  // Extract relationships
  let relsMap = {};
  let hyperlinkMap = {};
  try {
    const relsXml = await extractTextFile(
      buffer,
      entries,
      "word/_rels/document.xml.rels",
    );
    const parsed = parseRelationships(relsXml);
    relsMap = parsed.imageMap;
    hyperlinkMap = parsed.hyperlinkMap;
  } catch (e) {
    console.error("Could not parse relationships:", e);
  }

  // Extract images
  const images = await extractImages(buffer, entries);

  // Parse document
  const sections = parseDocumentXml(xmlString, relsMap, hyperlinkMap);

  return { sections, images };
}

export async function fetchAndParseDocx() {
  const cacheBuster = `?t=${Date.now()}`;

  // Fetch both docx files in parallel
  const [mainResponse, auteurResponse] = await Promise.all([
    fetch(`/api/docx${cacheBuster}`, { cache: "no-store" }),
    fetch(`/api/docx-auteur?t=${Date.now()}`, { cache: "no-store" }),
  ]);

  if (!mainResponse.ok)
    throw new Error(`Failed to fetch main document: ${mainResponse.status}`);

  const mainBuffer = await mainResponse.arrayBuffer();
  const mainResult = await parseDocxBuffer(mainBuffer);

  let auteurResult = null;
  if (auteurResponse.ok) {
    try {
      const auteurBuffer = await auteurResponse.arrayBuffer();
      auteurResult = await parseDocxBuffer(auteurBuffer);
    } catch (e) {
      console.error("Could not parse auteur document:", e);
    }
  } else {
    console.error("Failed to fetch auteur document:", auteurResponse.status);
  }

  return {
    sections: mainResult.sections,
    images: { ...mainResult.images, ...(auteurResult?.images || {}) },
    auteurSections: auteurResult?.sections || null,
  };
}
