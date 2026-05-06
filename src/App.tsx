/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Heart, 
  Brain, 
  Thermometer, 
  Scale, 
  Droplet, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2,
  Menu,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface PredictionResponse {
  prediction: string;
  confidence: number;
}

export default function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    age: 45,
    bloodPressure: 120,
    cholesterol: 200,
    bmi: 24.5,
    bloodSugar: 95,
    heartRate: 72,
  });

  const handleInputChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Mapping form data to features array expected by model
      const features = [
        formData.age,
        formData.bloodPressure,
        formData.cholesterol,
        formData.bmi,
        formData.bloodSugar,
        formData.heartRate
      ];

      const response = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features }),
      });

      if (!response.ok) {
        throw new Error('Prediction failed. Ensure the backend is running.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const isHighRisk = result?.prediction === 'High Risk';

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500 selection:text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-600 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600 blur-[120px] rounded-full opacity-50" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center animate-pulse">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold tracking-tighter text-xl uppercase italic">Lumina <span className="text-orange-500">AI</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#" className="hover:text-white transition-colors">Diagnostics</a>
            <a href="#" className="hover:text-white transition-colors">Lab Reports</a>
            <a href="#" className="hover:text-white transition-colors">Research</a>
          </nav>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-white/20 text-white/50 px-3 py-1 font-mono">SCIKIT-LEARN v1.4</Badge>
            <Button size="icon" variant="ghost" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Hero & Info */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-orange-600/10 text-orange-500 hover:bg-orange-600/20 border-orange-600/20 mb-4 px-4 py-1.5 uppercase tracking-widest text-[10px] font-bold">
                Precision Health Intelligence
              </Badge>
              <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.85] uppercase mb-6">
                Predict<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">The Invisible</span>
              </h1>
              <p className="text-lg text-white/60 max-w-lg leading-relaxed font-light">
                Utilize our proprietary Random Forest classifiers to analyze clinical biomarkers. 
                Identify potential heart health risks before symptoms emerge.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: ShieldCheck, title: "Data Security", desc: "End-to-end encrypted local processing" },
                { icon: Brain, title: "Neural Logic", desc: "Trained on 10k+ diverse clinical records" },
                { icon: Zap, title: "Real-time", desc: "Sub-10ms inference time on edge" },
                { icon: Activity, title: "Live Sync", desc: "Connects with wearable health APIs" },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                >
                  <item.icon className="w-6 h-6 text-orange-500 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-white/40">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Prediction Engine */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
              <CardHeader className="border-b border-white/5 p-8 bg-gradient-to-b from-white/5 to-transparent">
                <CardTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Activity className="w-6 h-6 text-orange-500" />
                  Clinical Parameter Input
                </CardTitle>
                <CardDescription className="text-white/40">
                  Input patient biological data for diagnostic inference.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-8 space-y-8">
                {/* Age & BMI */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] uppercase tracking-widest text-white/50">Age (Years)</Label>
                      <span className="text-sm font-mono text-orange-500">{formData.age}</span>
                    </div>
                    <Slider 
                      value={[formData.age]} 
                      onValueChange={(v) => handleInputChange('age', Array.isArray(v) ? v[0] : v)} 
                      min={18} max={100} step={1}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] uppercase tracking-widest text-white/50">BMI (kg/m²)</Label>
                      <span className="text-sm font-mono text-orange-500">{formData.bmi}</span>
                    </div>
                    <Slider 
                      value={[formData.bmi]} 
                      onValueChange={(v) => handleInputChange('bmi', Array.isArray(v) ? v[0] : v)} 
                      min={10} max={50} step={0.1}
                    />
                  </div>
                </div>

                {/* BP & Cholesterol */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] uppercase tracking-widest text-white/50">Blood Pressure</Label>
                      <span className="text-sm font-mono text-orange-500">{formData.bloodPressure}</span>
                    </div>
                    <Slider 
                      value={[formData.bloodPressure]} 
                      onValueChange={(v) => handleInputChange('bloodPressure', Array.isArray(v) ? v[0] : v)} 
                      min={80} max={200} step={1}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] uppercase tracking-widest text-white/50">Cholesterol</Label>
                      <span className="text-sm font-mono text-orange-500">{formData.cholesterol}</span>
                    </div>
                    <Slider 
                      value={[formData.cholesterol]} 
                      onValueChange={(v) => handleInputChange('cholesterol', Array.isArray(v) ? v[0] : v)} 
                      min={100} max={400} step={1}
                    />
                  </div>
                </div>

                {/* Sugar & Heart Rate */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] uppercase tracking-widest text-white/50">Blood Sugar</Label>
                      <span className="text-sm font-mono text-orange-500">{formData.bloodSugar}</span>
                    </div>
                    <Slider 
                      value={[formData.bloodSugar]} 
                      onValueChange={(v) => handleInputChange('bloodSugar', Array.isArray(v) ? v[0] : v)} 
                      min={60} max={250} step={1}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] uppercase tracking-widest text-white/50">Heart Rate</Label>
                      <span className="text-sm font-mono text-orange-500">{formData.heartRate}</span>
                    </div>
                    <Slider 
                      value={[formData.heartRate]} 
                      onValueChange={(v) => handleInputChange('heartRate', Array.isArray(v) ? v[0] : v)} 
                      min={40} max={180} step={1}
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs flex items-center gap-3"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  {result && (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-6 rounded-2xl border ${isHighRisk ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'} space-y-4`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isHighRisk ? <AlertCircle className="w-6 h-6 text-red-500" /> : <CheckCircle2 className="w-6 h-6 text-green-500" />}
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold opacity-50">Diagnostic Result</p>
                            <h4 className={`text-xl font-black italic uppercase ${isHighRisk ? 'text-red-500' : 'text-green-500'}`}>
                              {result.prediction}
                            </h4>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-widest font-bold opacity-50">Confidence</p>
                          <p className="text-xl font-mono">{(result.confidence * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                      <Progress 
                        value={result.confidence * 100} 
                        className={`h-2 ${isHighRisk ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'}`}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>

              <CardFooter className="p-8 pt-0">
                <Button 
                  onClick={handlePredict} 
                  disabled={loading}
                  className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg uppercase italic transition-all group overflow-hidden relative"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Activity className="w-5 h-5 animate-spin" />
                        Analyzing Sequence...
                      </>
                    ) : (
                      <>
                        Compute Diagnosis
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Lumina v3.0 // Clinical Intelligence System</span>
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-orange-500 transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Terms of Diagnostic Service</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Lab Integration</a>
          </div>
          <div className="text-[10px] font-mono">
            &copy; 2026 LUMINA.HEALTH // ALL BYTES RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}
