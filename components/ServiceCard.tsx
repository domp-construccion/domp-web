import { Service } from "@/lib/data";
import Link from "next/link";
import ServiceIcon from "./ServiceIcon";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link
      href={`/especialidades/${service.id}`}
      className="block bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
    >
      <div className="flex justify-center mb-4">
        <ServiceIcon name={service.id} size={48} className="text-gray-900" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
      <p className="text-gray-600 mb-4">{service.description}</p>
      <ul className="space-y-2 mb-4">
        {service.benefits.slice(0, 3).map((benefit, index) => (
          <li key={index} className="flex items-start text-sm text-gray-700">
            <span className="text-accent mr-2">✓</span>
            {benefit}
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-500 italic">
        Ideal para: {service.idealClient}
      </p>
    </Link>
  );
}

