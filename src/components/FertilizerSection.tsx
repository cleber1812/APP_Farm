import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Primeiro, adicione os novos estados para fertilizantes
interface Fertilizer {
    name: string;
    type: string;
    applicationType: string;
    quantityPerHectare: number;
    quantityPerPlant: number;
    frequency: number;
    totalQuantity: number;
    pricePerKg: number;
    totalCost: number;
  }

interface FertilizerSectionProps {
    plants: number; 
    densityPerHectare: number; 
    totalCycleDays: number;  
    onFertilizerCostChange: (fertilizer: number) => void;  // nova prop
  }

const FERTILIZER_TYPES = ["De plantio", "De cobertura", "Foliar", "Defensivo"];
const APPLICATION_TYPES = ["Única", "Semanal"] as const;  // usando 'as const' para tipagem literal


export function FertilizerSection({ plants, densityPerHectare, totalCycleDays, onFertilizerCostChange }: FertilizerSectionProps) {    
    const [fertilizers, setFertilizers] = useState<Fertilizer[]>([
        {
          name: "Uréia (N 45%)",
          type: "De plantio",
          quantityPerHectare: 110,
          quantityPerPlant: 0,
          applicationType: "Única",
          frequency: 1,
          totalQuantity: 0,
          pricePerKg: 3.4,
          totalCost: 0
        },
        {
          name: "Fosfato SuperSimples (H2PO4)",
          type: "De plantio",
          quantityPerHectare: 1100,
          quantityPerPlant: 0,
          applicationType: "Única",
          frequency: 1,
          totalQuantity: 0,
          pricePerKg: 2.3,
          totalCost: 0
        },
        {
          name: "Cloreto de Potássio (KCl 60%)",
          type: "De plantio",
          quantityPerHectare: 100,
          quantityPerPlant: 0,
          applicationType: "Única",
          frequency: 1,
          totalQuantity: 0,
          pricePerKg: 3.2,
          totalCost: 0
        },
        {
          name: "Esterco bovino",
          type: "De plantio",
          quantityPerHectare: 2500,
          quantityPerPlant: 0,
          applicationType: "Única",
          frequency: 1,
          totalQuantity: 0,
          pricePerKg: 1.25,
          totalCost: 0
        },
        {
          name: "Amiorgan",
          type: "De cobertura",
          quantityPerHectare: 13.2,
          quantityPerPlant: 0,
          applicationType: "Semanal",
          frequency: 1,
          totalQuantity: 0,
          pricePerKg: 3.2,
          totalCost: 0
        },
        {
          name: "Cloreto de Potássio (KCl 60%)",
          type: "De cobertura",
          quantityPerHectare: 9,
          quantityPerPlant: 0,
          applicationType: "Semanal",
          frequency: 1,
          totalQuantity: 0,
          pricePerKg: 4.99,
          totalCost: 0
        },
        {
          name: "Sulfato de magnésio",
          type: "De cobertura",
          quantityPerHectare: 8.4,
          quantityPerPlant: 0,
          applicationType: "Semanal",
          frequency: 1,
          totalQuantity: 0,
          pricePerKg: 3.6,
          totalCost: 0
        },
        {
          name: "Nitrato de cálcio",
          type: "De cobertura",
          quantityPerHectare: 7.2,
          quantityPerPlant: 0,
          applicationType: "Semanal",
          frequency: 1,
          totalQuantity: 0,
          pricePerKg: 5,
          totalCost: 0
        },
        {
          name: "Sulfato de zinco",
          type: "De cobertura",
          quantityPerHectare: 12,
          quantityPerPlant: 0,
          applicationType: "Única",
          frequency: 1,
          totalQuantity: 0,
          pricePerKg: 16,
          totalCost: 0
        },
        {
          name: "Nipokan",
          type: "Foliar",
          quantityPerHectare: 0.030,
          quantityPerPlant: 0,
          applicationType: "Semanal",
          frequency: 3,
          totalQuantity: 0,
          pricePerKg: 90,
          totalCost: 0
        },
        {
          name: "CaB2",
          type: "Foliar",
          quantityPerHectare: 0.050,
          quantityPerPlant: 0,
          applicationType: "Semanal",
          frequency: 3,
          totalQuantity: 0,
          pricePerKg: 55,
          totalCost: 0
        },
        {
          name: "Provado",
          type: "Defensivo",
          quantityPerHectare: 0.020,
          quantityPerPlant: 0,
          applicationType: "Semanal",
          frequency: 3,
          totalQuantity: 0,
          pricePerKg: 170,
          totalCost: 0
        },
        {
          name: "Dithane",
          type: "Defensivo",
          quantityPerHectare: 0.030,
          quantityPerPlant: 0,
          applicationType: "Semanal",
          frequency: 3,
          totalQuantity: 0,
          pricePerKg: 250,
          totalCost: 0
        },
        {
          name: "Difere",
          type: "Defensivo",
          quantityPerHectare: 0.030,
          quantityPerPlant: 0,
          applicationType: "Semanal",
          frequency: 3,
          totalQuantity: 0,
          pricePerKg: 150,
          totalCost: 0
        },
      ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFertilizer, setNewFertilizer] = useState<Partial<Fertilizer>>({
      name: "",
      type: "De plantio",
      quantityPerHectare: 0,      
      applicationType: "Única",
      frequency: 1,
      pricePerKg: 0
    });
          
    // Remova o estado totalFertilizerCost e calcule-o diretamente
    const totalFertilizerCost = fertilizers.reduce((sum, fert) => sum + fert.totalCost, 0);

    //Calculate subtotals for each fertilizer type
    const getSubtotalByType = (type: string) => {
      return fertilizers
          .filter(fert => fert.type === type)
          .reduce((sum, fert) => sum + fert.totalCost, 0);
    };

    // Adicione esta função antes do return
    const getTypeStyle = (type: string) => {
      switch (type) {
          case "De plantio":
              return "bg-orange-800 text-orange-50";
          case "De cobertura":
              return "bg-sky-600 text-sky-50";
          case "Foliar":
              return "bg-green-600 text-green-50";
          case "Defensivo":
            return "bg-orange-500 text-orange-50";
          default:
              return "bg-blue-300 text-blue-800";
      }
    };

    useEffect(() => {
        const updatedFertilizers = fertilizers.map(fert => {

            // Cálculo por planta
            const quantityPerPlant = fert.quantityPerHectare / densityPerHectare * 1000;

            // Cálculo baseado no tipo de aplicação
            const weeksNumber = (totalCycleDays / 7) - 4;
            const totalQuantity = fert.applicationType === "Única"
              ? (plants * fert.quantityPerPlant * fert.frequency) / 1000  // Cálculo para aplicação única
              : (plants * weeksNumber * fert.quantityPerPlant * fert.frequency) / 1000;
            const totalCost = totalQuantity * fert.pricePerKg;
            return {
                ...fert,
                quantityPerPlant,
                totalQuantity,
                totalCost
            };
        });

        setFertilizers(updatedFertilizers);
    }, [plants, densityPerHectare, totalCycleDays, fertilizers.map(f => `${f.quantityPerHectare}-${f.quantityPerPlant}-${f.frequency}-${f.pricePerKg}`).join('-')]);

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

  const deleteFertilizer = (index: number) => {
    const newFertilizers = fertilizers.filter((_, i) => i !== index);
    setFertilizers(newFertilizers);
  };

  const handleAddFertilizer = () => {
    if (newFertilizer.name && newFertilizer.type && newFertilizer.applicationType && newFertilizer.quantityPerHectare && newFertilizer.frequency && newFertilizer.pricePerKg) {
      const fertilizerToAdd: Fertilizer = {
        name: newFertilizer.name,
        type: newFertilizer.type,
        quantityPerHectare: Number(newFertilizer.quantityPerHectare),
        quantityPerPlant: 0,
        applicationType: newFertilizer.applicationType,
        frequency: Number(newFertilizer.frequency),
        totalQuantity: 0,
        pricePerKg: Number(newFertilizer.pricePerKg),
        totalCost: 0
      };

      setFertilizers([...fertilizers, fertilizerToAdd]);
      setNewFertilizer({
        name: "",
        type: "De plantio",
        quantityPerHectare: 0,
        applicationType: "Única",
        frequency: 1,
        pricePerKg: 0
      });
      setIsModalOpen(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
        <CardHeader>
          <div >
            <div>
              <CardTitle>Adubação</CardTitle>
              <div className="text-lg font-medium">Categoria: Material de Consumo</div>
            </div>
            <div className="flex justify-end items-center">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Incluir Fertilizante
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Fertilizante</DialogTitle>
                  <DialogDescription>Inclui um novo fertilizante na simulação</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Fertilizante</Label>
                    <Input
                      id="name"
                      value={newFertilizer.name}
                      onChange={(e) => setNewFertilizer({ ...newFertilizer, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo de Fertilizante</Label>
                    <select
                      id="type"
                      value={newFertilizer.type}
                      onChange={(e) => setNewFertilizer({ ...newFertilizer, type: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {/* <option value="" disabled>Selecione o tipo</option> */}
                      {FERTILIZER_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quantityPerHectare">Quantidade por Hectare (kg)</Label>
                    <Input
                      id="quantityPerHectare"
                      type="number"
                      min="0"
                      step="1"
                      value={newFertilizer.quantityPerHectare}
                      onChange={(e) => setNewFertilizer({ ...newFertilizer, quantityPerHectare: Number(e.target.value) })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo de Aplicação</Label>
                    <select
                      id="applicationType"
                      value={newFertilizer.applicationType}
                      onChange={(e) => setNewFertilizer({ ...newFertilizer, applicationType: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                    >                      
                      {APPLICATION_TYPES.map((applicationType) => (
                        <option key={applicationType} value={applicationType}>
                          {applicationType}
                        </option>
                      ))}
                    </select>
                  </div>                  
                  <div className="grid gap-2">
                    <Label htmlFor="frequency">Frequência</Label>
                    <Input
                      id="frequency"
                      type="number"
                      min="1"
                      step="1"
                      value={newFertilizer.frequency}
                      onChange={(e) => setNewFertilizer({ ...newFertilizer, frequency: Number(e.target.value) })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pricePerKg">Preço/KG (R$)</Label>
                    <Input
                      id="pricePerKg"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newFertilizer.pricePerKg}
                      onChange={(e) => setNewFertilizer({ ...newFertilizer, pricePerKg: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancelar</Button>
                  </DialogClose>                  
                  <Button onClick={handleAddFertilizer}>
                    Salvar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px] text-center">Fertilizante</TableHead>
                <TableHead className="min-w-[120px] text-center">Tipo de Fertilizante</TableHead>
                <TableHead className="min-w-[90px] text-center">Quant/hectare (kg)</TableHead>
                <TableHead className="min-w-[90px] text-center">Quant/ planta (g)</TableHead>
                <TableHead className="min-w-[90px] text-center">Tipo de Aplicação</TableHead>
                <TableHead className="min-w-[90px] text-center">Frequência</TableHead>
                <TableHead className="min-w-[90px] text-center">Quantidade total (Kg)</TableHead>
                <TableHead className="min-w-[90px] text-center">Preço/KG (R$)</TableHead>
                <TableHead className="min-w-[90px] text-center">Custo fertilizante (R$)</TableHead>
                <TableHead className="min-w-[70px] text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fertilizers.map((fertilizer, index) => (
                <TableRow key={index}>
                  <TableCell>{fertilizer.name}</TableCell>
                  <td><span className={`text-xs font-thin px-2 py-1 rounded-full ${getTypeStyle(fertilizer.type)}`}>
                    {fertilizer.type}
                  </span></td>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={fertilizer.quantityPerHectare}
                      onChange={(e) => updateFertilizer(index, 'quantityPerHectare', Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {fertilizer.quantityPerPlant.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <td><span className="text-xs font-thin px-2 py-1 rounded-full bg-neutral-600 text-neutral-50">
                    {fertilizer.applicationType}
                  </span></td>                  
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
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteFertilizer(index)}
                      className="hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {/* Subtotals for each type */}
              {FERTILIZER_TYPES.map(type => (
                <TableRow key={type} className="bg-muted/50">
                  <TableCell colSpan={8} className="text-right font-medium">
                    Subtotal {type}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    R$ {getSubtotalByType(type).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell />
                </TableRow>
              ))}
              {/* Total geral */}
              <TableRow className="font-medium border-t-2">
                <TableCell colSpan={8} className="text-right">Total de Fertilizantes</TableCell>
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

