"use client";

import { useParams } from "next/navigation";
import PropertyForm from "@/components/admin/property-form";

export default function EditProperty() {
  const { id } = useParams<{ id: string }>();
  return <PropertyForm key={id} id={id} />;
}
