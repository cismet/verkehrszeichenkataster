import {
  Page,
  Text,
  View,
  Document,
  Image,
} from "@react-pdf/renderer";
import ExternalSidebar from "./components/ExternalSidebar";
import Contact from "./components/Contact";
import { mdParser } from "../mdredactor/MdRedactor";


const TextWithTitle = ({ title, text }) => {
  return (
    <View
      style={{
        textAlign: "left",
        fontSize: 14,
        gap: 6,
      }}
    >
      <Text style={{ textDecoration: "underline", paddingTop: 10 }}>
        {title}
      </Text>
      <Text style={{ maxWidth: "70%" }}>{text}</Text>
    </View>
  );
};

const ExternalTemplate = ({ timeline, title }) => {
  return (
    <Document>
      <Page
        size="A4"
        style={{
          flexDirection: "row",
          padding: 20,
          gap: 6,
          fontSize: 14,
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "column" }}>
          <View fixed={true}>
            <Text>Wupperwurm</Text>
          </View>
          <Contact />
          <View style={{ textAlign: "right" }}>
            <Text>15.01.2024</Text>
          </View>
          <Text style={{ textDecoration: "underline" }}>{title}</Text>
          <Text style={{ fontSize: 10 }}>(Anordnung Nr. 001/2024)</Text>
          {timeline?.map((attachment) => {
            if (attachment.typ === "text") {
              return (
                <TextWithTitle title={attachment.name} text={attachment.text} />
              );
            } else if (attachment.typ === "file") {
              return <Image src={attachment.file} />;
            }
          })}
        </View>
        <ExternalSidebar />
      </Page>
    </Document>
  );
};

export default ExternalTemplate;
