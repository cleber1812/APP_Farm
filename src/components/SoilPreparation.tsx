import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface SoilPreparationProps {
  area: number;
  onTotalCostChange: (soil: number) => void;
}

export function SoilPreparation({ area, onTotalCostChange }: SoilPreparationProps) {
  const [preparationType, setPreparationType] = useState("byMachine");
  const [machineHourPrice, setMachineHourPrice] = useState(200.00);
  const [gradeHours, setGradeHours] = useState(0);
  const [aradoHours, setAradoHours] = useState(0);
  const [servicePrice, setServicePrice] = useState(0);
  const [totalPreparationCost, setTotalPreparationCost] = useState(0);
  const [totalMachineHours, setTotalMachineHours] = useState(0);
  

  // Inicialização dos valores
  useEffect(() => {    
      const calculatedGradeHours = Math.round(area * 0.0005 * 100) / 100;
      const calculatedAradoHours = Math.round(area * 0.0004 * 100) / 100;
      
      setGradeHours(calculatedGradeHours);
      setAradoHours(calculatedAradoHours); 
  }, [area]);

  // Cálculos que dependem das alterações dos inputs
  useEffect(() => {
    if (preparationType === "byMachine") {
      const totalHours = gradeHours + aradoHours;
      const calculatedTotal = Math.round(machineHourPrice * totalHours * 100) / 100;
      setTotalMachineHours(totalHours);
      setTotalPreparationCost(calculatedTotal);
      setServicePrice(calculatedTotal);
    } else {
      setTotalPreparationCost(servicePrice);
    }
    onTotalCostChange(totalPreparationCost);
  }, [area, machineHourPrice, gradeHours, aradoHours, servicePrice, preparationType, onTotalCostChange]);


  // converter valores decimais em formato de horas e minutos
  const formatHours = (decimalHours: number): string => {
    // Converte o valor decimal em minutos totais
    const totalMinutes = Math.round(decimalHours * 60);    
    // Calcula as horas e minutos
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;    
    // Formata os minutos para sempre ter dois dígitos
    const formattedMinutes = minutes.toString().padStart(2, '0');    
    // Retorna no formato "H:MM"
    return `${hours}:${formattedMinutes}`;
  };

  // Reseta para os valores iniciais quando volta para hora-máquina
  const handlePreparationTypeChange = (newType: string) => {
    setPreparationType(newType);
    if (newType === "byMachine") {      
      setGradeHours(Math.round(area * 0.0005 * 100) / 100);
      setAradoHours(Math.round(area * 0.0004 * 100) / 100); 
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Preparação de Solo</CardTitle>
        <div className="text-lg font-medium">Categoria: Serviços</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <RadioGroup
            value={preparationType}
            onValueChange={handlePreparationTypeChange}
            className="mb-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="byMachine" id="byMachine" />
              <Label htmlFor="byMachine">Na hora-máquina</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="byService" id="byService" />
              <Label htmlFor="byService">Na empreitada</Label>
            </div>
          </RadioGroup>

          <Table>
            <TableBody>
              {preparationType === "byMachine" ? (
                <>
                  <TableRow>
                    <TableCell>Valor hora-máquina (R$)</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={machineHourPrice}
                        onChange={(e) => setMachineHourPrice(Number(e.target.value))}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Grade (hora)</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={gradeHours}
                        onChange={(e) => setGradeHours(Number(e.target.value))}
                      />
                    </TableCell>
                    <TableCell>{formatHours(gradeHours)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Arado (hora)</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={aradoHours}
                        onChange={(e) => setAradoHours(Number(e.target.value))}
                      />                      
                    </TableCell>
                    <TableCell>{formatHours(aradoHours)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tempo total de máquina (hora)</TableCell>                    
                    <TableCell>{formatHours(totalMachineHours)}</TableCell>
                  </TableRow>
                </>
              ) : (
                <TableRow>
                  <TableCell>Valor do serviço (R$)</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={servicePrice}
                      onChange={(e) => setServicePrice(Number(e.target.value))}
                    />
                  </TableCell>
                </TableRow>
              )}
              <TableRow className="font-medium">
                <TableCell>Total do preparo (R$)</TableCell>
                <TableCell>
                  R$ {totalPreparationCost.toLocaleString('pt-BR', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}