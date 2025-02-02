import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, DollarSign, Wallet } from "lucide-react";
import { LaborSection } from '../components/LaborSection';  // ajuste o caminho conforme necessário
import { SoilPreparation } from '../components/SoilPreparation';
import { FertilizerSection } from '../components/FertilizerSection';  // ajuste o caminho conforme necessário


export function Home () {
  // Plantel states
  const [calculationType, setCalculationType] = useState("byPlants");
  const [plants, setPlants] = useState(1000);
  const [area, setArea] = useState(2000);
  const [rowSpacing, setRowSpacing] = useState(1.00);
  const [plantSpacing, setPlantSpacing] = useState(0.40);

  // Calculated Plantel values
  const [densityPerHectare, setDensityPerHectare] = useState(0);
  const [calculatedArea, setCalculatedArea] = useState(0);
  const [calculatedPlants, setCalculatedPlants] = useState(0);

  // Produtividade states
  const [firstCycleProduction, setFirstCycleProduction] = useState(1.00);
  const [firstCycleStart, setFirstCycleStart] = useState(100);
  const [firstCycleDuration, setFirstCycleDuration] = useState(90);    
  const [secondCycleProduction, setSecondCycleProduction] = useState(0.50);
  const [secondCycleDuration, setSecondCycleDuration] = useState(60);    
  const [thirdCycleProduction, setThirdCycleProduction] = useState(0.25);
  const [thirdCycleDuration, setThirdCycleDuration] = useState(60);

  // Calculated states    
  const [firstCycleQuant, setFirstCycleQuant] = useState(0);
  const [secondCycleQuant, setSecondCycleQuant] = useState(0);
  const [secondCycleStart, setSecondCycleStart] = useState(0);
  const [thirdCycleQuant, setThirdCycleQuant] = useState(0);
  const [thirdCycleStart, setThirdCycleStart] = useState(0);
  const [totalCycleDays, setTotalCycleDays] = useState(0);
  const [perPlantProductivity, setPerPlantProductivity] = useState(0);
  const [totalProductivity, setTotalProductivity] = useState(0);

  // Mudas states
  const [reservePercentage, setReservePercentage] = useState(10);
  const [seedlingUnitPrice, setSeedlingUnitPrice] = useState(0.20);

  // Calculated Mudas values
  const [totalSeedlings, setTotalSeedlings] = useState(0);
  const [totalSeedlingsCost, setTotalSeedlingsCost] = useState(0);

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

  // Análise de Solo states
  const [soilAnalysisProvider, setSoilAnalysisProvider] = useState("Epamig");
  const [soilAnalysisCost, setSoilAnalysisCost] = useState(120.99);

  // Vendas states
  const [wholesalePrice, setWholesalePrice] = useState(7.00);
  const [retailPrice, setRetailPrice] = useState(12.00);
  const [wholesalePercentage, setWholesalePercentage] = useState(70);

  // Calculated Vendas values
  const [perKgRevenue, setPerKgRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Investimentos values
  const [irrigationInvestCost, setIrrigationInvestCost] = useState(4900.99);
  const [machineInvestCost , setMachineInvestCost] = useState(1800.95);

  useEffect(() => {
    // Área calculations
    const density = 10000 / (rowSpacing * plantSpacing);
    setDensityPerHectare(density);

    if (calculationType === "byPlants") {
      setCalculatedArea(plants * rowSpacing * plantSpacing);
    //   setArea(calculatedArea)
    } else {
      setCalculatedPlants(
        (!rowSpacing || !plantSpacing || rowSpacing === 0 || plantSpacing === 0) 
          ? 1 
          : Math.floor(area / (rowSpacing * plantSpacing))
      );
      setPlants(calculatedPlants)
      setCalculatedArea(area)
    }    

    // Cycle production calculations
    const firstTotQuant = firstCycleProduction * plants;
    const secondTotQuant = secondCycleProduction * plants;
    const thirdTotQuant = thirdCycleProduction * plants;
    
    setFirstCycleQuant(firstTotQuant);
    setSecondCycleQuant(secondTotQuant);
    setThirdCycleQuant(thirdTotQuant);

    // Cycle start dates calculations
    const secondStart = firstCycleStart + firstCycleDuration + 60;
    const thirdStart = secondStart + secondCycleDuration + 60;
    const totalDays = thirdStart + thirdCycleDuration;
    
    setSecondCycleStart(secondStart);
    setThirdCycleStart(thirdStart);
    setTotalCycleDays(totalDays);

    // Calculate per plant productivity and Total productivity
    const perPlantProd = firstCycleProduction + secondCycleProduction + thirdCycleProduction;
    setPerPlantProductivity(perPlantProd);
    
    const totalProd = plants * perPlantProd;
    setTotalProductivity(totalProd);

    // SECAO MUDAS
    // Calcula o total de mudas (quantidade + reserva)
    const reserveAmount = Math.ceil(plants * (reservePercentage / 100));
    const totalSeedlingsCalc = plants + reserveAmount;
    setTotalSeedlings(totalSeedlingsCalc);

    // Calcula o custo total das mudas
    const totalCost = totalSeedlingsCalc * seedlingUnitPrice;
    setTotalSeedlingsCost(totalCost);

    // SECAO IRRIGAÇÃO
    // Calculate dripping hose length
    const hoseLength = calculatedArea / rowSpacing;
    setDrippingHose(hoseLength);

    // Calculate sprinklers quant
    const sprinklersQty = Math.ceil(calculatedArea / 20);
    setSprinklersCount(sprinklersQty);  

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
    
    // SECAO VENDAS
    // Calculate per plant revenue and total revenue
    const wholesaleRevenue = wholesalePrice * (wholesalePercentage / 100);
    const retailRevenue = retailPrice * ((100 - wholesalePercentage) / 100);
    setPerKgRevenue(wholesaleRevenue + retailRevenue);

    setTotalRevenue((wholesaleRevenue + retailRevenue)*totalProd);

  }, [plants, area, rowSpacing, plantSpacing, calculationType,
    firstCycleProduction, secondCycleProduction, thirdCycleProduction,
    firstCycleStart, firstCycleDuration, secondCycleDuration, thirdCycleDuration,
    reservePercentage, seedlingUnitPrice,
    totalCycleDays, calculatedArea,
    irrigationType, irrigationHours, holeFlow, holesPerMeter, sprinklerFlow, waterCost, pumpConsumption, energyCost,
    soilAnalysisCost,
    wholesalePrice, retailPrice, wholesalePercentage,
  ]);
  

  // Funções auxiliares para card Resultado
  const calculatePercentage = (value: number, total: number) => {
    return total ? (value / total * 100) : 0;
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatPercentage = (value: number) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
  };


  // Variáveis retornadas dos COMPONENTES //
  const [laborCosts, setLaborCosts] = useState(0);

  const [soilPreparationCost, setSoilPreparationCost] = useState(0);

  const [fertilizerCost, setFertilizerCost] = useState(0);


  // Seção RESULTADOS e DASHBOARD
  // // Calcular custos totais
  const consumptionCosts = totalSeedlingsCost + fertilizerCost;
  const serviceCosts = totalIrrigationCost + soilAnalysisCost + soilPreparationCost;
  

  const totalCosts = consumptionCosts + serviceCosts + laborCosts;
  
  const totalInvestiments = irrigationInvestCost + machineInvestCost;

  // Calcular lucro líquido
  const netRevenue = totalRevenue - totalCosts;
  
  // Calcular lucratividade
  const profitability = calculatePercentage(netRevenue , totalRevenue);  
  
  // Calcular relação benefício/custo
  const costBenefitRatio = totalRevenue / totalCosts;
  
  // Calcular custo médio
  const averageCost = totalCosts / totalProductivity;
  
  // Calcular percentual de custo sobre faturamento
  const costPercentage = calculatePercentage(totalCosts , totalRevenue);

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Área do Plantel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            defaultValue="byPlants"
            onValueChange={setCalculationType}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="byPlants" id="byPlants" />
              <Label htmlFor="byPlants">Calcular por número de mudas</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="byArea" id="byArea" />
              <Label htmlFor="byArea">Calcular por área disponível</Label>
            </div>
          </RadioGroup>

          {calculationType === "byPlants" ? (
            <div>
              <Label htmlFor="plants">Número de mudas</Label>
              <Input
                id="plants"
                type="number"
                value={plants}
                onChange={(e) => setPlants(Number(e.target.value))}
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="area">Área disponível (m²)</Label>
              <Input
                id="area"
                type="number"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
              />
            </div>
          )}

          <div className="space-y-4">
            <Label>Adensamento</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="rowSpacing">Entre linhas (m)</Label>
                <Input
                  id="rowSpacing"
                  type="number"
                  step="0.01"
                  value={rowSpacing}
                  onChange={(e) => setRowSpacing(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="plantSpacing">Entre plantas (m)</Label>
                <Input
                  id="plantSpacing"
                  type="number"
                  step="0.01"
                  value={plantSpacing}
                  onChange={(e) => setPlantSpacing(Number(e.target.value))}
                />
              </div>
              <div className="pt-2">
                <Label>Adensamento por ha</Label>
                <p className="text-lg font-medium">
                  {densityPerHectare.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} plantas/ha
                </p>
              </div>
            </div>
          </div>

          <div>
            {calculationType === "byPlants" ? (
              <>
                <Label>Área utilizada</Label>
                <p className="text-lg font-medium">
                  {calculatedArea.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} m²
                </p>
              </>
            ) : (
              <>
                <Label>Número de mudas necessário</Label>
                <p className="text-lg font-medium">
                  {calculatedPlants.toLocaleString('pt-BR')} mudas
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Produtividade</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Safra</TableHead>
                <TableHead>Produtividade (kg/planta)</TableHead>
                <TableHead>Produtividade (kg/total)</TableHead>
                <TableHead>Início da colheita (dias)</TableHead>
                <TableHead>Duração da colheita (dias)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>1ª safra</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.1"
                    value={firstCycleProduction}
                    onChange={(e) => setFirstCycleProduction(Number(e.target.value))}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={firstCycleQuant}
                    readOnly
                    className="bg-muted"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={firstCycleStart}
                    onChange={(e) => setFirstCycleStart(Number(e.target.value))}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={firstCycleDuration}
                    onChange={(e) => setFirstCycleDuration(Number(e.target.value))}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2ª safra</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.1"
                    value={secondCycleProduction}
                    onChange={(e) => setSecondCycleProduction(Number(e.target.value))}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={secondCycleQuant}
                    readOnly
                    className="bg-muted"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={secondCycleStart}
                    readOnly
                    className="bg-muted"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={secondCycleDuration}
                    onChange={(e) => setSecondCycleDuration(Number(e.target.value))}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>3ª safra</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.1"
                    value={thirdCycleProduction}
                    onChange={(e) => setThirdCycleProduction(Number(e.target.value))}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={thirdCycleQuant}
                    readOnly
                    className="bg-muted"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={thirdCycleStart}
                    readOnly
                    className="bg-muted"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={thirdCycleDuration}
                    onChange={(e) => setThirdCycleDuration(Number(e.target.value))}
                  />
                </TableCell>
              </TableRow>
              <TableRow className="font-medium">
                <TableCell colSpan={3}>Total do ciclo</TableCell>
                <TableCell>{totalCycleDays} dias</TableCell>
              </TableRow>
              <TableRow className="font-medium">
                <TableCell colSpan={3}>Produtividade</TableCell>
                <TableCell>{perPlantProductivity.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} kg/planta</TableCell>
                <TableCell>{totalProductivity.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} kg total</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Análise de solo</CardTitle>
          <div className="text-lg font-medium">Categoria: Serviços</div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Label>Fornecedor</Label>
                  <Input
                    value={soilAnalysisProvider}
                    onChange={(e) => setSoilAnalysisProvider(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Label>Valor (R$)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={soilAnalysisCost}
                    onChange={(e) => setSoilAnalysisCost(Number(e.target.value))}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>


      <SoilPreparation 
        area={calculatedArea} 
        onTotalCostChange={(soil) => setSoilPreparationCost(soil)} 
      />


      
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Irrigação</CardTitle>
          <div className="text-lg font-medium">Categoria: Serviços</div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label>Tipo de Irrigação</Label>
            <RadioGroup
              defaultValue="dripping"
              onValueChange={setIrrigationType}
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


      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Mudas</CardTitle>
          <div className="text-lg font-medium">Categoria: Material de Consumo</div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Quantidade (mudas)</TableCell>
                <TableCell>{plants.toLocaleString('pt-BR')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Reserva (%)</TableCell>
                <TableCell className="space-y-2">                  
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={reservePercentage}
                    onChange={(e) => setReservePercentage(Number(e.target.value))}
                  />
                </TableCell>
                {/* <TableCell>{Math.ceil(plants * (reservePercentage / 100)).toLocaleString('pt-BR')}</TableCell> */}
              </TableRow>
              <TableRow>
                <TableCell>Total de mudas (quant)</TableCell>
                <TableCell>{totalSeedlings.toLocaleString('pt-BR')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Valor unitário (R$)</TableCell>
                <TableCell className="space-y-2">                  
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={seedlingUnitPrice}
                    onChange={(e) => setSeedlingUnitPrice(Number(e.target.value))}
                  />
                </TableCell>
                {/* <TableCell>R$ {seedlingUnitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell> */}
              </TableRow>
              <TableRow className="font-medium">
                <TableCell>Total de mudas (R$)</TableCell>
                <TableCell>R$ {totalSeedlingsCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      
      <FertilizerSection 
        plants={plants}        
        onFertilizerCostChange={(fertilizer) => setFertilizerCost(fertilizer)}
      />


      <LaborSection 
        plants={plants}
        area={calculatedArea}
        totalCycleDays={totalCycleDays}
        totalProductivity={totalProductivity}
        onLaborCostChange={(labor) => setLaborCosts(labor)}
      />


      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Vendas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="wholesale">Atacado (R$/kg)</Label>
              <Input
                id="wholesale"
                type="number"
                step="0.01"
                value={wholesalePrice}
                onChange={(e) => setWholesalePrice(Number(e.target.value))}
              />
              <p className="mt-2 text-lg font-medium">{wholesalePercentage}%</p>
            </div>
            <div>
              <Label htmlFor="retail">Varejo (R$/kg)</Label>
              <Input
                id="retail"
                type="number"
                step="0.01"
                value={retailPrice}
                onChange={(e) => setRetailPrice(Number(e.target.value))}
              />
              <p className="mt-2 text-lg font-medium">{100 - wholesalePercentage}%</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Distribuição de Vendas</Label>
            <Slider
              value={[wholesalePercentage]}
              onValueChange={(values) => setWholesalePercentage(values[0])}
              max={100}
              step={1}
            />
          </div>
          <Table>
            <TableBody>
              <TableRow className="font-medium">                
                <TableCell>Preço Médio: R$ {perKgRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / kg</TableCell>
                <TableCell>Receita Total: R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>


      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Investimentos</CardTitle>
          {/* <div className="text-lg font-medium">Categoria: Serviços</div> */}
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Label>Irrigação (R$)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={irrigationInvestCost}
                    onChange={(e) => setIrrigationInvestCost(Number(e.target.value))}
                  />
                </TableCell>
                <TableCell>
                  <Label>Máquinas (R$)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={machineInvestCost}
                    onChange={(e) => setMachineInvestCost(Number(e.target.value))}
                  />
                </TableCell>
              </TableRow>
              <TableRow className="font-medium">
                <TableCell>Total Investimentos</TableCell>
                <TableCell className="text-right">{formatCurrency(totalInvestiments)}</TableCell>                
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      
      <Card className="w-full max-w-2xl bg-slate-50 border-2 border-slate-200">
        <CardHeader className="bg-slate-100">
          <CardTitle>Resumo dos custos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              {/* Receita */}
              {/* <TableRow className="font-medium">
                <TableCell>Receita de vendas</TableCell>
                <TableCell className="text-right">{formatCurrency(totalRevenue)}</TableCell>
                <TableCell className="text-right">100%</TableCell>
              </TableRow> */}

              {/* Serviços */}
              <TableRow className="bg-slate-100">
                <TableCell colSpan={3} className="font-medium">Serviços</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Irrigação</TableCell>
                <TableCell className="text-right">{formatCurrency(totalIrrigationCost)}</TableCell>
                <TableCell className="text-right">{formatPercentage(calculatePercentage(totalIrrigationCost, totalRevenue))}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Análise de solo</TableCell>
                <TableCell className="text-right">{formatCurrency(soilAnalysisCost)}</TableCell>
                <TableCell className="text-right">{formatPercentage(calculatePercentage(soilAnalysisCost, totalRevenue))}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Preparação de solo</TableCell>
                <TableCell className="text-right">{formatCurrency(soilPreparationCost)}</TableCell>
                <TableCell className="text-right">{formatPercentage(calculatePercentage(soilPreparationCost, totalRevenue))}</TableCell>
              </TableRow>
              <TableRow className="font-medium">
                <TableCell>Total Serviços</TableCell>
                <TableCell className="text-right">{formatCurrency(serviceCosts)}</TableCell>
                <TableCell className="text-right">{formatPercentage(calculatePercentage(serviceCosts, totalRevenue))}</TableCell>
              </TableRow> 
              
              {/* Material de Consumo */}
              <TableRow className="bg-slate-100">
                <TableCell colSpan={3} className="font-medium">Material de Consumo</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Mudas</TableCell>
                <TableCell className="text-right">{formatCurrency(totalSeedlingsCost)}</TableCell>
                <TableCell className="text-right">{formatPercentage(calculatePercentage(totalSeedlingsCost, totalRevenue))}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Adubação (de Plantio)</TableCell>
                <TableCell className="text-right">{formatCurrency(fertilizerCost)}</TableCell>
                <TableCell className="text-right">{formatPercentage(calculatePercentage(fertilizerCost, totalRevenue))}</TableCell>
              </TableRow>
              <TableRow className="font-medium">
                <TableCell>Total Material de Consumo</TableCell>
                <TableCell className="text-right">{formatCurrency(consumptionCosts)}</TableCell>
                <TableCell className="text-right">{formatPercentage(calculatePercentage(consumptionCosts, totalRevenue))}</TableCell>
              </TableRow>

              {/* Mão de obra */}
              <TableRow className="bg-slate-100">
                <TableCell colSpan={3} className="font-medium">Mão de obra</TableCell>
              </TableRow>              
              <TableRow className="font-medium">
                <TableCell>Total Mão de obra</TableCell>
                <TableCell className="text-right">{formatCurrency(laborCosts)}</TableCell>
                <TableCell className="text-right">{formatPercentage(calculatePercentage(laborCosts, totalRevenue))}</TableCell>
              </TableRow>              

              {/* Lucro Líquido */}
              {/* <TableRow className="font-medium text-lg border-t-2">
                <TableCell>Lucro Líquido</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(netRevenue)}
                </TableCell>
                <TableCell className="text-right">
                  {formatPercentage(profitability)}
                </TableCell>
              </TableRow> */}
            
            </TableBody>
          </Table>
        </CardContent>
      </Card>


      <div className="w-full max-w-2xl grid gap-6 md:grid-cols-2">
      {/* Card de Receita */}
      <Card className="p-6 space-y-6">
          {/* <h3 className="text-xl font-semibold">Receita</h3> */}
        <div className="flex items-center justify-between">
          {/* Indicador Principal */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Receita de vendas</p>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
          <DollarSign className="h-14 w-14 text-green-500" />
        </div>                  

        {/* Indicadores Secundários */}
        <div className="grid gap-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Receita Líquida</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Valor descontado todos os custos</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-lg font-semibold">{formatCurrency(netRevenue)}</p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Lucratividade</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Percentual do lucro sobre o faturamento</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-lg font-semibold">{formatPercentage(profitability)}</p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Relação benefício custo</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Vendas para cada um real de custo</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-lg font-semibold">{costBenefitRatio.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Card de Despesa */}
      <Card className="p-6 space-y-6">
          {/* <h3 className="text-xl font-semibold">Despesa</h3> */}
        <div className="flex items-center justify-between">
          {/* Indicador Principal */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Custo total</p>
          <p className="text-3xl font-bold text-red-600">
            {formatCurrency(totalCosts)}
          </p>
        </div>
          <Wallet className="h-16 w-14 text-red-500" />
        </div>        

        {/* Indicadores Secundários */}
        <div className="grid gap-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Custo total médio (CTMe)</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Custo médio por Kg</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-lg font-semibold">{formatCurrency(averageCost)} /kg</p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">CT (%)</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Percentual do custo sobre o faturamento</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-lg font-semibold">{formatPercentage(costPercentage)}</p>
            </div>
          </div>
        </div>
      </Card>
      </div>     


    </div>
  );
};
