import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function Home () {
  // Área do Plantel states
  const [calculationType, setCalculationType] = useState("byPlants");
  const [plants, setPlants] = useState(1000);
  const [area, setArea] = useState(2000);
  const [rowSpacing, setRowSpacing] = useState(1.00);
  const [plantSpacing, setPlantSpacing] = useState(0.40);

  // Vendas states
  const [wholesalePrice, setWholesalePrice] = useState(7.00);
  const [retailPrice, setRetailPrice] = useState(12.00);
  const [wholesalePercentage, setWholesalePercentage] = useState(70);

  // Produtividade states
  const [firstCycleProduction, setFirstCycleProduction] = useState(1.00);
  const [firstCycleStart, setFirstCycleStart] = useState(100);
  const [firstCycleDuration, setFirstCycleDuration] = useState(90);
    
  const [secondCycleProduction, setSecondCycleProduction] = useState(0.50);
  const [secondCycleDuration, setSecondCycleDuration] = useState(60);
    
  const [thirdCycleProduction, setThirdCycleProduction] = useState(0.25);
  const [thirdCycleDuration, setThirdCycleDuration] = useState(60);

  // Calculated states  
  const [densityPerHectare, setDensityPerHectare] = useState(0);
  const [calculatedArea, setCalculatedArea] = useState(0);
  const [calculatedPlants, setCalculatedPlants] = useState(0);
  const [firstCycleQuant, setFirstCycleQuant] = useState(0);
  const [secondCycleQuant, setSecondCycleQuant] = useState(0);
  const [thirdCycleQuant, setThirdCycleQuant] = useState(0);
  const [secondCycleStart, setSecondCycleStart] = useState(0);
  const [thirdCycleStart, setThirdCycleStart] = useState(0);
  const [totalCycleDays, setTotalCycleDays] = useState(0);
  const [perPlantProductivity, setPerPlantProductivity] = useState(0);
  const [perKgRevenue, setPerKgRevenue] = useState(0);
  const [totalProductivity, setTotalProductivity] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    // Área calculations
    const density = 10000 / (rowSpacing * plantSpacing);
    setDensityPerHectare(density);

    if (calculationType === "byPlants") {
      setCalculatedArea(plants * rowSpacing * plantSpacing);
    //   setArea(calculatedArea)
    } else {
      setCalculatedPlants(Math.floor(area / (rowSpacing * plantSpacing)));
      setPlants(calculatedPlants)
    }

    // Cycle start dates calculations
    const secondStart = firstCycleStart + firstCycleDuration + 60;
    const thirdStart = secondStart + secondCycleDuration + 60;
    const totalDays = thirdStart + thirdCycleDuration;
    
    setSecondCycleStart(secondStart);
    setThirdCycleStart(thirdStart);
    setTotalCycleDays(totalDays);

    // Cycle production calculations
    const firstTotQuant = firstCycleProduction * plants;
    const secondTotQuant = secondCycleProduction * plants;
    const thirdTotQuant = thirdCycleProduction * plants;
    
    setFirstCycleQuant(firstTotQuant);
    setSecondCycleQuant(secondTotQuant);
    setThirdCycleQuant(thirdTotQuant);

    // Calculate per plant productivity and Total productivity
    const perPlantProd = firstCycleProduction + secondCycleProduction + thirdCycleProduction;
    setPerPlantProductivity(perPlantProd);
    
    const totalProd = plants * perPlantProd;
    setTotalProductivity(totalProd);

    // Calculate per plant revenue and total revenue
    const wholesaleRevenue = wholesalePrice * (wholesalePercentage / 100);
    const retailRevenue = retailPrice * ((100 - wholesalePercentage) / 100);
    setPerKgRevenue(wholesaleRevenue + retailRevenue);
    
    setTotalRevenue((wholesaleRevenue + retailRevenue)*totalProd);

  }, [plants, area, rowSpacing, plantSpacing, calculationType,
    firstCycleStart, firstCycleDuration, secondCycleDuration, thirdCycleDuration,
    firstCycleProduction, secondCycleProduction, thirdCycleProduction,
    wholesalePrice, retailPrice, wholesalePercentage]);

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
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            <div className="pt-2">
              <Label>Adensamento por ha</Label>
              <p className="text-lg font-medium">
                {densityPerHectare.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} plantas/ha
              </p>
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
                <TableHead>Ciclo</TableHead>
                <TableHead>Produtividade (kg/planta)</TableHead>
                <TableHead>Produtividade (kg/total)</TableHead>
                <TableHead>Início da colheita (dias)</TableHead>
                <TableHead>Duração da colheita (dias)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>1º ciclo</TableCell>
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
                <TableCell>2º ciclo</TableCell>
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
                <TableCell>3º ciclo</TableCell>
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
              <TableRow className="font-medium">
                <TableCell colSpan={3}>Receita</TableCell>
                <TableCell>R$ {perKgRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / kg</TableCell>
                <TableCell>R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} total</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>


    </div>
  );
};
