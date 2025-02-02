import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface IrrigationSectionProps {
    rowSpacing: number;
    calculatedArea: number;
    totalCycleDays: number;    
    onIrrigationCostChange: (irrigation: number) => void;  // nova prop
  }

export function IrrigationSection({ rowSpacing, calculatedArea, totalCycleDays, onIrrigationCostChange }: IrrigationSectionProps) {

    // Irrigation states
    const [irrigationType, setIrrigationType] = useState("dripping");
    const [irrigationHours, setIrrigationHours] = useState(1);
    const [holesPerMeter, setHolesPerMeter] = useState(5);
    const [holeFlow, setHoleFlow] = useState(1.6);
    const [sprinklerFlow, setSprinklerFlow] = useState(75);
    const [waterCost, setWaterCost] = useState(1.29);
    const [pumpConsumption, setPumpConsumption] = useState(3.750);
    const [energyCost, setEnergyCost] = useState(0.99);

    // Calculated irrigation values
    const [drippingHose, setDrippingHose] = useState(0);
    const [sprinklersCount, setSprinklersCount] = useState(0);
    const [waterQuantity, setWaterQuantity] = useState(0);
    const [totalWaterCost, setTotalWaterCost] = useState(0);
    const [energyQuantity, setEnergyQuantity] = useState(0);
    const [totalEnergyCost, setTotalEnergyCost] = useState(0);
    const [totalIrrigationCost, setTotalIrrigationCost] = useState(0);

    // Inicialização dos valores do INPUT sprinklersQty com cálculo 
    useEffect(() => {
        // Calculate sprinklers quant
        const sprinklersQty = Math.ceil(calculatedArea / 20);
        setSprinklersCount(sprinklersQty);  
    }, [calculatedArea]);

    useEffect(() => {
        // SECAO IRRIGAÇÃO
        // Calculate dripping hose length
        const hoseLength = calculatedArea / rowSpacing;
        setDrippingHose(hoseLength);

        // Calculate water quantity in thousands of liters
        let waterQty = 0;

        if (irrigationType === "dripping") {
        waterQty = (totalCycleDays * irrigationHours * hoseLength * holeFlow * holesPerMeter) / 1000;    
        } else {
        waterQty = (totalCycleDays * irrigationHours * sprinklersCount * sprinklerFlow) / 1000;
        }
        setWaterQuantity(waterQty);

        // Calculate total water cost
        const waterTotalCost = waterQty * waterCost;
        setTotalWaterCost(waterTotalCost);

        // Calculate energy quantity
        const energyQty = totalCycleDays * irrigationHours * pumpConsumption;
        setEnergyQuantity(energyQty);

        // Calculate total energy cost
        const energyTotalCost = energyQty * energyCost;
        setTotalEnergyCost(energyTotalCost);

        // Calculate total Irrigation cost
        const irrigationTotalCost = waterTotalCost + energyTotalCost;
        setTotalIrrigationCost(irrigationTotalCost);

        onIrrigationCostChange(irrigationTotalCost); // chama o callback com o valor atualizado

    }, [calculatedArea, rowSpacing,
        sprinklersCount,
        irrigationType, irrigationHours, holeFlow, holesPerMeter, sprinklerFlow, waterCost, pumpConsumption, energyCost,
        onIrrigationCostChange // importante adicionar na dependência do useEffect
    ]);

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

    // Reseta para os valores iniciais quando volta para mangueira gotejadora
    const handleIrrigationTypeChange = (newType: string) => {
        setIrrigationType(newType);
        if (newType === "dripping") {
            setSprinklersCount(Math.ceil(calculatedArea / 20));
        }
    };

  return (
    
    <Card className="w-full max-w-2xl">
        <CardHeader>
        <CardTitle>Irrigação</CardTitle>
        <div className="text-lg font-medium">Categoria: Serviços</div>
        </CardHeader>
        <CardContent>
        <div className="space-y-3">            
            <RadioGroup
            defaultValue="dripping"
            onValueChange={handleIrrigationTypeChange}
            className="flex flex-col space-y-1"
            >
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="dripping" id="dripping" />
                <Label htmlFor="dripping">Mangueira gotejadora</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="sprinkler" id="sprinkler" />
                <Label htmlFor="sprinkler">Microaspersor</Label>
            </div>
            </RadioGroup>
        </div>

        <Table>            
            <TableBody>
            <TableRow>
                <TableCell>
                <Label>Duração (dias)</Label>
                </TableCell>
                <TableCell>
                <p className="text-lg font-medium">{totalCycleDays}</p>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell>
                <Label htmlFor="hours">Tempo (horas)</Label>
                </TableCell>
                <TableCell>
                <Input
                    id="hours"
                    type="number"
                    step="0.1"
                    value={irrigationHours}
                    onChange={(e) => setIrrigationHours(Number(e.target.value))}
                />
                </TableCell>
                <TableCell>{formatHours(irrigationHours)}</TableCell>
            </TableRow>

            {irrigationType === "dripping" ? (
                <>
                <TableRow>
                    <TableCell>
                    <Label>Mangueira gotejadora (metro linear)</Label>
                    </TableCell>
                    <TableCell>
                    <p className="text-lg font-medium">
                        {drippingHose.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                    </p>
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>
                    <Label htmlFor="holeFlow">Vazão furo (L/h)</Label>
                    </TableCell>
                    <TableCell>
                    <Input
                        id="holeFlow"
                        type="number"
                        step="0.1"
                        value={holeFlow}
                        onChange={(e) => setHoleFlow(Number(e.target.value))}
                    />
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>
                    <Label htmlFor="holesPerMeter">Furos por metro</Label>
                    </TableCell>
                    <TableCell>
                    <Input
                        id="holesPerMeter"
                        type="number"
                        step="1"
                        value={holesPerMeter}
                        onChange={(e) => setHolesPerMeter(Number(e.target.value))}
                    />
                    </TableCell>
                </TableRow>
                </>
            ) : (
                <>
                <TableRow>
                    <TableCell>
                    <Label htmlFor="sprinklersCount">Aspersores (quant)</Label>
                    </TableCell>
                    <TableCell>
                    <Input
                        id="sprinklersCount"
                        type="number"
                        step="1"
                        value={sprinklersCount}
                        onChange={(e) => setSprinklersCount(Number(e.target.value))}
                    />
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>
                    <Label htmlFor="sprinklerFlow">Vazão aspersor (L/h)</Label>
                    </TableCell>
                    <TableCell>
                    <Input
                        id="sprinklerFlow"
                        type="number"
                        step="0.1"
                        value={sprinklerFlow}
                        onChange={(e) => setSprinklerFlow(Number(e.target.value))}
                    />
                    </TableCell>
                </TableRow>
                </>
            )}

            <TableRow>
                <TableCell>
                <Label>Quant. Água (1.000L)</Label>
                </TableCell>
                <TableCell>
                <p className="text-lg font-medium">
                    {waterQuantity.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                </p>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell>
                <Label htmlFor="waterCost">Custo Água (1.000L)</Label>
                </TableCell>
                <TableCell>
                <Input
                    id="waterCost"
                    type="number"
                    step="0.01"
                    value={waterCost}
                    onChange={(e) => setWaterCost(Number(e.target.value))}
                />
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell>
                <Label>Gasto Total (Água)</Label>
                </TableCell>
                <TableCell>
                <p className="text-lg font-medium">
                    R$ {totalWaterCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell>
                <Label htmlFor="pumpConsumption">Consumo Bomba (kW/h)</Label>
                </TableCell>
                <TableCell>
                <Input
                    id="pumpConsumption"
                    type="number"
                    step="0.001"
                    value={pumpConsumption}
                    onChange={(e) => setPumpConsumption(Number(e.target.value))}
                />
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell>
                <Label>Quant. Energia</Label>
                </TableCell>
                <TableCell>
                <p className="text-lg font-medium">
                    {energyQuantity.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                </p>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell>
                <Label htmlFor="energyCost">Custo Energia (kW/h)</Label>
                </TableCell>
                <TableCell>
                <Input
                    id="energyCost"
                    type="number"
                    step="0.01"
                    value={energyCost}
                    onChange={(e) => setEnergyCost(Number(e.target.value))}
                />
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell>
                <Label>Gasto Total (Energia)</Label>
                </TableCell>
                <TableCell>
                <p className="text-lg font-medium">
                    R$ {totalEnergyCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                </TableCell>
            </TableRow>
            </TableBody>
        </Table>
            <div className="grid grid-cols-2 gap-4 text-lg font-medium">
                <div> Total de Irrigação (R$) </div>
                <div>
                R$ {totalIrrigationCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
            </div>
        </CardContent>
    </Card>

  );
};

