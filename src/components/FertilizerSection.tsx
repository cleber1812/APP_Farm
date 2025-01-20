import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from "@/components/ui/table";

// Primeiro, adicione os novos estados para fertilizantes
interface Fertilizer {
    name: string;
    quantityPerPlant: number;
    frequency: number;
    totalQuantity: number;
    pricePerKg: number;
    totalCost: number;
  }

interface FertilizerSectionProps {
    plants: number;    
    onFertilizerCostChange: (fertilizer: number) => void;  // nova prop
  }

export function FertilizerSection({ plants, onFertilizerCostChange }: FertilizerSectionProps) {
    
    const [fertilizers, setFertilizers] = useState<Fertilizer[]>([
        {
          name: "Uréia (N 45%)",
          quantityPerPlant: 6,
          frequency: 3,
          totalQuantity: 0,
          pricePerKg: 3.99,
          totalCost: 0
        },
        {
          name: "Fosfato SuperSimples (H2PO4)",
          quantityPerPlant: 40,
          frequency: 3,
          totalQuantity: 0,
          pricePerKg: 2.99,
          totalCost: 0
        },
        {
          name: "Cloreto de Potássio (KCl 60%)",
          quantityPerPlant: 4,
          frequency: 3,
          totalQuantity: 0,
          pricePerKg: 4.99,
          totalCost: 0
        }
      ]);
      
    // Remova o estado totalFertilizerCost e calcule-o diretamente
    const totalFertilizerCost = fertilizers.reduce((sum, fert) => sum + fert.totalCost, 0);

    useEffect(() => {
        const updatedFertilizers = fertilizers.map(fert => {
            const totalQuantity = (plants * fert.quantityPerPlant * fert.frequency) / 1000;
            const totalCost = totalQuantity * fert.pricePerKg;
            return {
                ...fert,
                totalQuantity,
                totalCost
            };
        });

        setFertilizers(updatedFertilizers);
    }, [plants, fertilizers.map(f => `${f.quantityPerPlant}-${f.frequency}-${f.pricePerKg}`).join('-')]);

    // Efeito separado para notificar mudanças no custo total
    useEffect(() => {
        onFertilizerCostChange(totalFertilizerCost);
    }, [totalFertilizerCost, onFertilizerCostChange]);
  
  // Função auxiliar para atualizar um fertilizante específico
  const updateFertilizer = (index: number, field: keyof Fertilizer, value: string | number) => {
    const newFertilizers = [...fertilizers];
    newFertilizers[index] = {
      ...newFertilizers[index],
      [field]: value
    };
    setFertilizers(newFertilizers);
  };

  return (
    <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Adubação (de Plantio)</CardTitle>
          <div className="text-lg font-medium">Categoria: Material de Consumo</div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Fertilizante</TableHead>
                <TableHead className="text-center">Quant/planta (g)</TableHead>
                <TableHead className="text-center">Frequência</TableHead>
                <TableHead className="text-center">Quantidade total (Kg)</TableHead>
                <TableHead className="text-center">Preço/KG (R$)</TableHead>
                <TableHead className="text-center">Custo fertilizante (R$)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fertilizers.map((fertilizer, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      value={fertilizer.name}
                      onChange={(e) => updateFertilizer(index, 'name', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={fertilizer.quantityPerPlant}
                      onChange={(e) => updateFertilizer(index, 'quantityPerPlant', Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={fertilizer.frequency}
                      onChange={(e) => updateFertilizer(index, 'frequency', Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {fertilizer.totalQuantity.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={fertilizer.pricePerKg}
                      onChange={(e) => updateFertilizer(index, 'pricePerKg', Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    R$ {fertilizer.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-medium">
                <TableCell colSpan={5} className="text-right">Total de Fertilizantes</TableCell>
                <TableCell className="text-center">
                  R$ {totalFertilizerCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
  );
};

