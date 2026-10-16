import React from "react";
import { Document, Font, Link, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer";
import type { ResumeData, ResumeEntry } from "@/lib/resume-data";

export type ResumeLabels = { experience: string; education: string; technologies: string; title: string };

Font.register({ family: "NotoSansSC", src: "/fonts/NotoSansSC-Regular.ttf" });
Font.registerHyphenationCallback((word) => /\p{Script=Han}/u.test(word) ? Array.from(word) : [word]);

const styles = StyleSheet.create({
  page: { padding: 42, fontFamily: "Helvetica", fontSize: 10.5, lineHeight: 1.4, color: "#20252b" },
  name: { fontSize: 22, lineHeight: 1.25, marginBottom: 8 },
  contact: { fontSize: 9, color: "#344554", textDecoration: "none", marginBottom: 2 },
  section: { fontSize: 12, marginTop: 17, marginBottom: 9, paddingBottom: 4, borderBottomWidth: 0.6, borderBottomColor: "#9aa6ad" },
  entry: { marginBottom: 12 },
  title: { fontSize: 11.5 },
  dates: { fontSize: 9, color: "#58616b", marginTop: 2, marginBottom: 4 },
  bullet: { marginBottom: 3 },
  technologies: { fontSize: 9, color: "#414b55", marginTop: 3 },
});

export function ResumeDocument({ data, labels }: { data: ResumeData; labels: ResumeLabels }) {
  const bold = data.locale === "zh" ? {} : { fontFamily: "Helvetica-Bold" };
  // Keep normal CV entries together; allow unusually long content to paginate.
  const isLong = (entry: ResumeEntry) =>
    [entry.title, entry.organization, entry.technologies, ...entry.bullets].join(" ").length > 1200;
  function entryContent(entry: ResumeEntry) {
    return <View style={styles.entry} wrap={isLong(entry)}>
      <View wrap={false}>
        <Text style={[styles.title, bold]}>{entry.title}</Text>
        <Text>{entry.organization}</Text>
        <Text style={styles.dates}>{entry.dates}</Text>
      </View>
      {entry.bullets.map((bullet, i) => <Text key={i} style={styles.bullet} orphans={2} widows={2}>• {bullet}</Text>)}
      {entry.technologies && <Text style={styles.technologies}>{labels.technologies}: {entry.technologies}</Text>}
    </View>;
  }
  function entries(items: ResumeEntry[], title: string) {
    const [first, ...rest] = items;
    if (!first) return null;
    return <View>
      <View wrap={isLong(first)}>
        <Text style={[styles.section, bold]} minPresenceAhead={70}>{title}</Text>
        {entryContent(first)}
      </View>
      {rest.map((entry, index) => <React.Fragment key={index}>{entryContent(entry)}</React.Fragment>)}
    </View>;
  }
  return <Document title={`${data.name} - ${labels.title}`} author={data.name} language={data.locale}>
    <Page size="A4" style={[styles.page, data.locale === "zh" ? { fontFamily: "NotoSansSC" } : {}]}>
      <Text style={[styles.name, bold]}>{data.name}</Text>
      {data.contacts.map((contact) => <Link key={contact.href} src={contact.href} style={styles.contact}>{contact.text}</Link>)}
      {entries(data.jobs, labels.experience)}
      {entries(data.education, labels.education)}
    </Page>
  </Document>;
}

export async function createResumePdf(data: ResumeData, labels: ResumeLabels): Promise<Blob> {
  return pdf(<ResumeDocument data={data} labels={labels} />).toBlob();
}
