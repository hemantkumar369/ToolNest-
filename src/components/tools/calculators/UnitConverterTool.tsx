import React, { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'digital' | 'speed' | 'area';

interface UnitDef {
  label: string;
  factor: number; // relative to base
}

const UNITS: Record<UnitCategory, { base: string; list: Record<string, UnitDef> }> = {
  length: {
    base: 'meter',
    list: {
      meter: { label: 'Meter (m)', factor: 1 },
      kilometer: { label: 'Kilometer (km)', factor: 1000 },
      centimeter: { label: 'Centimeter (cm)', factor: 0.01 },
      millimeter: { label: 'Millimeter (mm)', factor: 0.001 },
      mile: { label: 'Mile (mi)', factor: 1609.344 },
      yard: { label: 'Yard (yd)', factor: 0.9144 },
      foot: { label: 'Foot (ft)', factor: 0.3048 },
      inch: { label: 'Inch (in)', factor: 0.0254 },
    }
  },
  weight: {
    base: 'kilogram',
    list: {
      kilogram: { label: 'Kilogram (kg)', factor: 1 },
      gram: { label: 'Gram (g)', factor: 0.001 },
      milligram: { label: 'Milligram (mg)', factor: 0.000001 },
      metric_ton: { label: 'Metric Ton (t)', factor: 1000 },
      pound: { label: 'Pound (lb)', factor: 0.45359237 },
      ounce: { label: 'Ounce (oz)', factor: 0.02834952 },
    }
  },
  temperature: {
    base: 'celsius',
    list: {
      celsius: { label: 'Celsius (°C)', factor: 1 },
      fahrenheit: { label: 'Fahrenheit (°F)', factor: 1 },
      kelvin: { label: 'Kelvin (K)', factor: 1 },
    }
  },
  digital: {
    base: 'byte',
    list: {
      byte: { label: 'Bytes (B)', factor: 1 },
      kilobyte: { label: 'Kilobytes (KB - 1024 B)', factor: 1024 },
      megabyte: { label: 'Megabytes (MB)', factor: 1024 * 1024 },
      gigabyte: { label: 'Gigabytes (GB)', factor: 1024 * 1024 * 1024 },
      terabyte: { label: 'Terabytes (TB)', factor: 1024 * 1024 * 1024 * 1024 },
    }
  },
  speed: {
    base: 'mps',
    list: {
      mps: { label: 'Meters / sec (m/s)', factor: 1 },
      kmh: { label: 'Kilometers / hour (km/h)', factor: 0.277778 },
      mph: { label: 'Miles / hour (mph)', factor: 0.44704 },
      knot: { label: 'Knots (kn)', factor: 0.514444 },
    }
  },
  area: {
    base: 'sqm',
    list: {
      sqm: { label: 'Square Meter (m²)', factor: 1 },
      sqkm: { label: 'Square Kilometer (km²)', factor: 1000000 },
      sqft: { label: 'Square Foot (ft²)', factor: 0.092903 },
      acre: { label: 'Acre (ac)', factor: 4046.86 },
      hectare: { label: 'Hectare (ha)', factor: 10000 },
    }
  }
};

export const UnitConverterTool: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState<string>('meter');
  const [toUnit, setToUnit] = useState<string>('foot');
  const [inputValue, setInputValue] = useState<number>(1);

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const keys = Object.keys(UNITS[cat].list);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  };

  const convert = (val: number): number => {
    if (isNaN(val)) return 0;
    if (category === 'temperature') {
      if (fromUnit === toUnit) return val;
      // Convert to Celsius first
      let c = val;
      if (fromUnit === 'fahrenheit') c = (val - 32) * (5 / 9);
      if (fromUnit === 'kelvin') c = val - 273.15;

      // Convert Celsius to target
      if (toUnit === 'celsius') return c;
      if (toUnit === 'fahrenheit') return (c * (9 / 5)) + 32;
      if (toUnit === 'kelvin') return c + 273.15;
      return c;
    }

    const fromFactor = UNITS[category].list[fromUnit]?.factor || 1;
    const toFactor = UNITS[category].list[toUnit]?.factor || 1;
    const inBase = val * fromFactor;
    return inBase / toFactor;
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const result = convert(inputValue);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Category selector */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(UNITS) as UnitCategory[]).map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryChange(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
              category === cat ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-4 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
        {/* From */}
        <div className="sm:col-span-2 space-y-2">
          <label className="block text-xs font-bold text-slate-700">From</label>
          <input
            type="number"
            value={inputValue}
            onChange={e => setInputValue(Number(e.target.value))}
            className="w-full p-3 bg-white border border-slate-300 rounded-xl text-lg font-bold"
          />
          <select
            value={fromUnit}
            onChange={e => setFromUnit(e.target.value)}
            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
          >
            {Object.entries(UNITS[category].list).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>

        {/* Swap button */}
        <div className="flex justify-center sm:col-span-1">
          <button
            onClick={swapUnits}
            className="p-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 text-slate-600 shadow-xs cursor-pointer"
            title="Swap units"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>

        {/* To */}
        <div className="sm:col-span-2 space-y-2">
          <label className="block text-xs font-bold text-slate-700">To</label>
          <div className="w-full p-3 bg-white border border-slate-300 rounded-xl text-lg font-bold text-blue-600 truncate">
            {Number(result.toPrecision(7))}
          </div>
          <select
            value={toUnit}
            onChange={e => setToUnit(e.target.value)}
            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
          >
            {Object.entries(UNITS[category].list).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
