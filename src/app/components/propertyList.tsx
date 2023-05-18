import Property from "./property";
import "./propertyList.css";

export default function PropertyList({ properties, updateProperty }: { properties: {}, updateProperty: (key: string, value: number) => void }) {
  return (
    <table className="border border-separate border-transparent border-spacing-y-1">
      <tbody>
        {Object.entries(properties).map(([key, value]) =>
          <tr key={key}>
            <Property
              name={key}
              value={value as number}
              setValue={nextValue => updateProperty(key, nextValue)} />
          </tr>
        )}
      </tbody>
    </table>
  );
}