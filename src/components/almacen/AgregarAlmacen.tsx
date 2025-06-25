"use client";
import React, { useState } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import Link from "next/link";
import { ChevronDownIcon, EyeCloseIcon, EyeIcon, TimeIcon } from '@/icons';
import DatePicker from '@/components/form/date-picker';

export default function AgregarAlmacen() {
  const [showPassword, setShowPassword] = useState(false);
  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };
  return (
    <ComponentCard title="Agregar Almacen">
      <div className="space-y-6">
        <div>
          <Label>Nombre Almacen</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Codigo de Almacen</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Dirección:</Label>
        </div>
        <div>
          <Label>Linea 1</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Linea 2</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Pais</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Estado</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Ciudad</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Codigo Postal</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Numero Telefónico</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Input with Placeholder</Label>
          <Input type="text" placeholder="info@gmail.com" />
        </div>
        <div>
          <Label>Select Input</Label>
          <div className="relative">
            <Select
            options={options}
            placeholder="Select an option"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
             <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon/>
            </span>
          </div>
        </div>

      </div>
    </ComponentCard>
  );
}
