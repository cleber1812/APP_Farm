import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function Catalog() {
  const [plants, setPlants] = useState(1000);
  const [rowSpacing, setRowSpacing] = useState(1.00);
  const [plantSpacing, setPlantSpacing] = useState(0.40);
  
  const [densityPerHectare, setDensityPerHectare] = useState(0);
  const [totalArea, setTotalArea] = useState(0);
  
  useEffect(() => {
    const density = 10000 / (rowSpacing * plantSpacing);
    const area = plants * rowSpacing * plantSpacing;
    
    setDensityPerHectare(density);
    setTotalArea(area);
  }, [plants, rowSpacing, plantSpacing]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Área do Plantel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="plants">Número de mudas</Label>
          <Input
            id="plants"
            type="number"
            value={plants}
            onChange={(e) => setPlants(Number(e.target.value))}
          />
        </div>

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
          <Label>Área utilizada</Label>
          <p className="text-lg font-medium">
            {totalArea.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} m²
          </p>
        </div>
      </CardContent>
    </Card>
  );
}