import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface LaborSectionProps {
    plants: number;
    area: number;
    totalCycleDays: number;
    totalProductivity: number;
    onLaborCostChange: (labor: number) => void;  // nova prop
  }

export function LaborSection({ plants, area, totalCycleDays, totalProductivity, onLaborCostChange }: LaborSectionProps) {

  // Main labor state
  const [dailyRate, setDailyRate] = useState(80.00);
  
  // Pesticide application states
  const [timesPerWeek, setTimesPerWeek] = useState(3);
  
  // Weeding states
  const [timesPerMonth, setTimesPerMonth] = useState(1);
  
  // Harvest states
  const [harvestType, setHarvestType] = useState("daily");
  const [kgPerDay, setKgPerDay] = useState(30);
  const [commissionRate, setCommissionRate] = useState(3.00);

  // Calculated values
  const [holesLaborDays, setHolesLaborDays] = useState(0);
  const [holesLaborCost, setHolesLaborCost] = useState(0);
  
  const [irrigationLaborDays, setIrrigationLaborDays] = useState(0);
  const [irrigationLaborCost, setIrrigationLaborCost] = useState(0);
  
  const [pesticideLaborDays, setPesticideLaborDays] = useState(0);
  const [pesticideLaborCost, setPesticideLaborCost] = useState(0);
  
  const [weedingLaborDays, setWeedingLaborDays] = useState(0);
  const [weedingLaborCost, setWeedingLaborCost] = useState(0);
  
  const [harvestLaborDays, setHarvestLaborDays] = useState(0);
  const [harvestLaborCost, setHarvestLaborCost] = useState(0);
  
  const [totalLaborDays, setTotalLaborDays] = useState(0);
  const [totalLaborCost, setTotalLaborCost] = useState(0);

  useEffect(() => {
    // Holes, fertilization and transplanting calculations
    const holesLabor = Math.round(plants * 0.0034);
    const holesCost = holesLabor * dailyRate;
    setHolesLaborDays(holesLabor);
    setHolesLaborCost(holesCost);

    // Irrigation setup calculations
    const irrigationLabor = Math.round(area * 0.0005);
    const irrigationCost = irrigationLabor * dailyRate;
    setIrrigationLaborDays(irrigationLabor);
    setIrrigationLaborCost(irrigationCost);

    // Pesticide application calculations
    const weeksNumber = (totalCycleDays / 7) - 4;
    const pesticidesLabor = Math.round(area * weeksNumber * timesPerWeek * 0.0001);
    const pesticidesCost = pesticidesLabor * dailyRate;
    setPesticideLaborDays(pesticidesLabor);
    setPesticideLaborCost(pesticidesCost);

    // Weeding calculations
    const monthsNumber = totalCycleDays / 30;
    const weedingLabor = Math.round(area * monthsNumber * timesPerMonth * 0.0010);
    const weedingCost = weedingLabor * dailyRate;
    setWeedingLaborDays(weedingLabor);
    setWeedingLaborCost(weedingCost);

    // Harvest calculations
    let harvestLabor = 0;
    let harvestCost = 0;

    if (harvestType === "daily") {
      harvestLabor = Math.round(totalProductivity / kgPerDay);
      harvestCost = harvestLabor * dailyRate;
    } else {
      harvestLabor = 0;
      harvestCost = totalProductivity * commissionRate;
    }
    setHarvestLaborDays(harvestLabor);
    setHarvestLaborCost(harvestCost);

    // Calculate totals
    const totalDays = holesLabor + irrigationLabor + pesticidesLabor + weedingLabor + harvestLabor;
    const totalCost = holesLaborCost + irrigationLaborCost + pesticidesCost + weedingCost + harvestCost;
    setTotalLaborDays(totalDays);
    setTotalLaborCost(totalCost);
    onLaborCostChange(totalCost); // chama o callback com o valor atualizado

  }, [plants, area, totalCycleDays, totalProductivity, 
    dailyRate, timesPerWeek, timesPerMonth, harvestType, kgPerDay, commissionRate,
    onLaborCostChange // importante adicionar na dependência do useEffect
    ]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Mão de Obra</CardTitle>
        <div className="text-lg font-medium">Categoria: Mão de Obra</div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Diária (R$)</TableCell>
              <TableCell className="space-y-2">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={dailyRate}
                  onChange={(e) => setDailyRate(Number(e.target.value))}
                />
              </TableCell>
            </TableRow>

            {/* Covas, Adubação e Transplantio */}
            <TableRow className="bg-muted/50">
              <TableCell colSpan={2} className="font-medium">Covas, Adubação e Transplantio</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Número de Diárias (quant)</TableCell>
              <TableCell>{holesLaborDays.toLocaleString('pt-BR')}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total (R$)</TableCell>
              <TableCell>R$ {holesLaborCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
            </TableRow>

            {/* Montagem da irrigação */}
            <TableRow className="bg-muted/50">
              <TableCell colSpan={2} className="font-medium">Montagem da irrigação</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Número de Diárias (quant)</TableCell>
              <TableCell>{irrigationLaborDays.toLocaleString('pt-BR')}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total (R$)</TableCell>
              <TableCell>R$ {irrigationLaborCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
            </TableRow>

            {/* Aplicação de adubos e defensivos */}
            <TableRow className="bg-muted/50">
              <TableCell colSpan={2} className="font-medium">Aplicação de adubos e defensivos</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Vezes por semana</TableCell>
              <TableCell className="space-y-2">
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={timesPerWeek}
                  onChange={(e) => setTimesPerWeek(Number(e.target.value))}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Número de Diárias (quant)</TableCell>
              <TableCell>{pesticideLaborDays.toLocaleString('pt-BR')}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total (R$)</TableCell>
              <TableCell>R$ {pesticideLaborCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
            </TableRow>

            {/* Capina */}
            <TableRow className="bg-muted/50">
              <TableCell colSpan={2} className="font-medium">Capina</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Vezes por mês</TableCell>
              <TableCell className="space-y-2">
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={timesPerMonth}
                  onChange={(e) => setTimesPerMonth(Number(e.target.value))}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Número de Diárias (quant)</TableCell>
              <TableCell>{weedingLaborDays.toLocaleString('pt-BR')}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total (R$)</TableCell>
              <TableCell>R$ {weedingLaborCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
            </TableRow>

            {/* Colheita */}
            <TableRow className="bg-muted/50">
              <TableCell colSpan={2} className="font-medium">Colheita</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Tipo de Colheita</TableCell>
              <TableCell>
                <RadioGroup
                  value={harvestType}
                  onValueChange={setHarvestType}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">Diária</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="commission" id="commission" />
                    <Label htmlFor="commission">Comissão</Label>
                  </div>
                </RadioGroup>
              </TableCell>
            </TableRow>
            {harvestType === "daily" ? (
              <>
                <TableRow>
                  <TableCell>Kg por dia</TableCell>
                  <TableCell className="space-y-2">
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={kgPerDay}
                      onChange={(e) => setKgPerDay(Number(e.target.value))}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Número de Diárias (quant)</TableCell>
                  <TableCell>{harvestLaborDays.toLocaleString('pt-BR')}</TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell>Comissão (R$/kg)</TableCell>
                <TableCell className="space-y-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                  />
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell>Total (R$)</TableCell>
              <TableCell>R$ {harvestLaborCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
            </TableRow>

            {/* Totals */}
            <TableRow className="font-medium">
              <TableCell>Total de diárias</TableCell>
              <TableCell>{totalLaborDays.toLocaleString('pt-BR')}</TableCell>
            </TableRow>
            <TableRow className="font-medium">
              <TableCell>Total de mão de obra (R$)</TableCell>
              <TableCell>R$ {totalLaborCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

