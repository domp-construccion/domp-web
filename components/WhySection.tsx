import SectionTitle from "./SectionTitle";
import { whyUs } from "@/lib/data";

export default function WhySection() {
  return (
    <section className="py-16 bg-background-light">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Por qué DomP"
          subtitle="Las razones que nos convierten en tu mejor opción"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyUs.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 text-center"
            >
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

