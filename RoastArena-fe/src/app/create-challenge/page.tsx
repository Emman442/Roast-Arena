
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BattleButton } from '@/components/ui/battle-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, Rocket, Coins, Target, ShieldCheck, Loader2, Clock } from 'lucide-react';
import Link from 'next/link';
import { useCreateChallenge } from '@/hooks/RoastArena';
import toast from '@/lib/utils/toast';

export default function CreateChallengePage() {
  const router = useRouter();
  const { isPending: isCreatingChallenge, mutate: CreateChallenge } = useCreateChallenge()

  const [formData, setFormData] = useState({
    bossName: '',
    projectName: '',
    prompt: '',
    prizePool: '',
    duration_seconds: 86400,
    createdAt: new Date().toISOString(),
  });
  console.log(formData)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    CreateChallenge({
      prompt: formData.prompt,
      founder_name: formData.bossName,
      project_name: formData.projectName,
      prize_pool: parseFloat(formData.prizePool),
      duration_seconds: formData.duration_seconds,
      created_at: formData.createdAt,
    }, {
      onSuccess: (data) => {
        toast.success("Challenge Created successfully!")
        router.push("/arena");

      },
      onError: (error) => {
        console.error("Error creating challenge:", error);
        toast.error("failed to create challenge, Please try again")
      },
    })
  };


  const DURATIONS = {
    "1h": 3600,
    "6h": 21600,
    "12h": 43200,
    "24h": 86400,
    "3d": 259200,
    "7d": 604800,
  };

  return (
    <div className="min-h-screen flex flex-col pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto w-full mb-8">
        <Link href="/" passHref>
          <BattleButton variant="ghost" size="sm" className="flex items-center gap-2 group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            BACK TO ARENAS
          </BattleButton>
        </Link>
      </div>

      <Card className="max-w-3xl mx-auto w-full glass border-primary/20 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary via-secondary to-battle-red" />
        <CardHeader className="space-y-2">
          <CardTitle className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-3">
            <Rocket className="w-8 h-8 text-primary" /> Launch <span className="text-primary">Challenge</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium italic">
            Put your project in the crosshairs. Fund the pool and let the savages roast you to the moon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                  <Target className="w-3 h-3" /> Founder Name
                </Label>
                <Input
                  placeholder="e.g. Vitalik Buterin"
                  className="bg-black/40 border-white/10"
                  value={formData.bossName}
                  onChange={(e) => setFormData({ ...formData, bossName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Project Name
                </Label>
                <Input
                  placeholder="e.g. Ethereum Foundation"
                  className="bg-black/40 border-white/10"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">The Roast Prompt</Label>
              <Input
                placeholder="e.g. Roast our gas fees until we ship the next upgrade."
                className="bg-black/40 border-white/10"
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                  <Coins className="w-3 h-3 text-gold" /> Prize Pool (GEN)
                </Label>
                <Input
                  type="number"
                  placeholder="500"
                  className="bg-black/40 border-white/10"
                  value={formData.prizePool}
                  onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                  required
                />
              </div>


              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-400" /> Challenge Duration
                </Label>
                <Select
                  value={formData.duration_seconds.toString()}
                  defaultValue='84600'
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      duration_seconds: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>

                  <SelectContent>
                    {Object.entries(DURATIONS).map(([label, value]) => (
                      <SelectItem key={value} value={value.toString()}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>




            <div className="pt-6">
              <BattleButton
                variant="primary"
                size="lg"
                className="w-full italic group"
                glowing
                type="submit"
                disabled={isCreatingChallenge}
              >
                {isCreatingChallenge ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <span className='flex gap-2 items-center'>DEPLOY CHALLENGE <Rocket className="w-8 h-8 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></span>
                )}
              </BattleButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
