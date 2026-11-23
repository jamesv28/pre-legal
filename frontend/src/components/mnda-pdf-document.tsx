import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { DocBlock } from "@/lib/mnda/build-document";
import { signatureRows } from "@/lib/mnda/signature";

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 60,
    paddingVertical: 56,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.45,
    color: "#18181b",
  },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  heading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    marginTop: 10,
    marginBottom: 4,
  },
  paragraph: { marginBottom: 6, textAlign: "justify" },
  bold: { fontFamily: "Helvetica-Bold" },
  field: { flexDirection: "row", marginBottom: 3 },
  checkbox: { paddingLeft: 12, marginBottom: 2 },
  table: { marginTop: 8, marginBottom: 8 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#a1a1aa",
    paddingVertical: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#d4d4d8",
    paddingVertical: 6,
  },
  labelCell: { width: "25%", fontFamily: "Helvetica-Bold" },
  valueCell: { width: "37.5%", paddingRight: 8 },
  note: { fontSize: 8, color: "#71717a", fontFamily: "Helvetica" },
  footer: { marginTop: 16, fontSize: 8, color: "#71717a" },
});

function BlockPdf({ block }: { block: DocBlock }) {
  switch (block.kind) {
    case "title":
      return <Text style={styles.title}>{block.text}</Text>;
    case "heading":
      return <Text style={styles.heading}>{block.text}</Text>;
    case "paragraph":
      return <Text style={styles.paragraph}>{block.text}</Text>;
    case "field":
      return (
        <Text style={styles.field}>
          <Text style={styles.bold}>{block.label}: </Text>
          <Text>{block.value}</Text>
        </Text>
      );
    case "checkbox":
      return (
        <Text style={styles.checkbox}>
          {`[${block.checked ? "x" : " "}] ${block.text}`}
        </Text>
      );
    case "section":
      return (
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>
            {`${block.number}. ${block.title}. `}
          </Text>
          <Text>{block.body}</Text>
        </Text>
      );
    case "signature":
      return (
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.labelCell} />
            <Text style={[styles.valueCell, styles.bold]}>Party 1</Text>
            <Text style={[styles.valueCell, styles.bold]}>Party 2</Text>
          </View>
          {signatureRows(block.parties).map((row) => (
            <View key={row.label} style={styles.tableRow} wrap={false}>
              <View style={styles.labelCell}>
                <Text>{row.label}</Text>
                {row.note && <Text style={styles.note}>{row.note}</Text>}
              </View>
              {row.values.map((value, i) => (
                <Text key={i} style={styles.valueCell}>
                  {value || " "}
                </Text>
              ))}
            </View>
          ))}
        </View>
      );
    case "footer":
      return <Text style={styles.footer}>{block.text}</Text>;
  }
}

/** PDF rendering of the document blocks, for download. */
export function MndaPdfDocument({ blocks }: { blocks: DocBlock[] }) {
  return (
    <Document title="Mutual Non-Disclosure Agreement">
      <Page size="LETTER" style={styles.page} wrap>
        {blocks.map((block, i) => (
          <BlockPdf key={i} block={block} />
        ))}
      </Page>
    </Document>
  );
}
