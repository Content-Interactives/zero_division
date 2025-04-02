import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceDot } from 'recharts';
import { Calculator, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Slider } from '../components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const ZeroDivision = () => {
  const denominatorValues = [-5, -4, -3, -2, -1, -0.5, -0.1, 0, 0.1, 0.5, 1, 2, 3, 4, 5];
  const [denominatorIndex, setDenominatorIndex] = useState(0);
  const [prevDenominatorIndex, setPrevDenominatorIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const numerator = 1;

  const denominator = denominatorValues[denominatorIndex];

  useEffect(() => {
    if (denominatorIndex > prevDenominatorIndex) {
      setDirection(1);
    } else if (denominatorIndex < prevDenominatorIndex) {
      setDirection(-1);
    }
    setPrevDenominatorIndex(denominatorIndex);
  }, [denominatorIndex, prevDenominatorIndex]);

  const formatResult = (result, isApproachingZero, isNegative) => {
    if (isApproachingZero) {
      if (isNegative) {
        return direction > 0 ? "Positive Infinity" : "Negative Infinity";
      } else {
        return direction > 0 ? "Negative Infinity" : "Positive Infinity";
      }
    }
    if (!isFinite(result)) {
      return result > 0 ? "Positive Infinity" : "Negative Infinity";
    }
    return result.toFixed(2);
  };

  const formatDivisor = (value) => {
    return value === 0 ? "0" : value.toFixed(2);
  };

  const generateChartData = () => {
    const data = [];
    for (let x = -5; x <= 5; x += 0.01) {
      if (x === 0) {
        continue; // Skip x = 0 to avoid division by zero
      }
      let y = numerator / x;
      data.push({
        x,
        y: Math.max(-100, Math.min(100, y)) // Clamp y values
      });
    }
    return data;
  };

  const chartData = generateChartData();

  const CustomYAxisTick = ({ x, y, payload }) => {
    let label;
    if (payload.value === 100) label = "+∞";
    else if (payload.value === -100) label = "-∞";
    else if (payload.value === 0) label = "0";
    else return null;

    return (
      <text x={x} y={y} dy={4} textAnchor="end" fill="#666" fontSize={12}>
        {label}
      </text>
    );
  };

  const getYValue = (x, isNegative = false) => {
    if (x === 0) {
      return isNegative ? (direction > 0 ? 100 : -100) : (direction > 0 ? -100 : 100);
    }
    const value = numerator / (isNegative ? -x : x);
    return Math.max(-100, Math.min(100, value));
  };

  const isApproachingZero = Math.abs(denominator) < 0.01;

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <Card className="w-full max-w-2xl mx-auto shadow-md bg-white">
        <CardHeader className="bg-sky-100 text-sky-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold">Division by Zero Explorer</CardTitle>
            <Calculator size={40} className="text-sky-600" />
          </div>
          <CardDescription className="text-sky-700 text-lg">Discover the Behavior of 1/x as x Approaches Zero!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <Alert className="bg-blue-50 border-blue-100">
            <Lightbulb className="h-4 w-4 text-blue-400" />
            <AlertTitle className="text-blue-700">Why can't we divide by 0?</AlertTitle>
            <AlertDescription className="text-blue-600">
              Dividing by zero is not possible for several reasons. One key issue is that as we approach division by zero from different directions, we can get both positive and negative infinity as results. This logical contradiction is why, in mathematics, division by 0 is defined as "undefined". The interactive below demonstrates this behavior as we get closer to dividing by zero.
            </AlertDescription>
          </Alert>
          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-700">Adjust the divisor (x):</label>
            <Slider
              min={0}
              max={denominatorValues.length - 1}
              step={1}
              value={[denominatorIndex]}
              onValueChange={(value) => setDenominatorIndex(value[0])}
              className="w-full"
            />
            <div className="space-y-4 text-center">
              <div className="p-4 bg-orange-100 rounded-lg">
                <p className="text-lg font-semibold text-orange-700">
                  1 ÷ {formatDivisor(denominator)} = {formatResult(numerator / denominator, isApproachingZero, false)}
                </p>
              </div>
              <div className="p-4 bg-purple-100 rounded-lg">
                <p className="text-lg font-semibold text-purple-700">
                  1 ÷ ({formatDivisor(-denominator)}) = {formatResult(numerator / -denominator, isApproachingZero, true)}
                </p>
              </div>
            </div>
            <div className="relative h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="x" 
                    type="number" 
                    domain={[-5, 5]} 
                    ticks={[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]}
                  />
                  <YAxis 
                    type="number" 
                    domain={[-100, 100]} 
                    ticks={[-100, 0, 100]}
                    tick={<CustomYAxisTick />}
                    width={30}
                  />
                  <Line type="monotone" dataKey="y" stroke="#1e40af" dot={false} />
                  <ReferenceDot x={denominator} y={getYValue(denominator)} r={6} fill="#f97316" stroke="none" />
                  <ReferenceDot x={-denominator} y={getYValue(denominator, true)} r={6} fill="#7e22ce" stroke="none" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ZeroDivision;