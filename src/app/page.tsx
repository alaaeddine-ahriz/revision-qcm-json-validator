"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter as DialogFtr,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { schoolsData } from "@/lib/schools";

interface MetaData {
  id: string;
  title: string;
  description: string;
  department: string;
  level: string;
  school: string;
}

const slug = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

const generateId = (title: string, dept: string, lvl: string, school: string) =>
  `${slug(title)}_${slug(dept)}_${slug(lvl)}_${slug(school)}`;

export default function Home() {
  const [texte, setTexte] = useState("");
  
  const [estValide, setEstValide] = useState<boolean | null>(null);

  const [open, setOpen] = useState(false);
  const [meta, setMeta] = useState<MetaData | null>(null);

  const verifier = () => {
    try {
      const parsed = JSON.parse(texte);
      const newId = generateId(parsed.title ?? "", parsed.department ?? "", parsed.level ?? "", parsed.school ?? "");
      if (newId && parsed.id !== newId) {
        parsed.id = newId;
        setTexte(JSON.stringify(parsed, null, 2));
      }
      setEstValide(true);
    } catch {
      setEstValide(false);
    }
  };

  const telecharger = () => {
    if (!estValide) return;
    const obj = JSON.parse(texte);
    let nom = (obj.id ?? "data") + ".json";
    const blob = new Blob([texte], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nom;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const ouvrirEdition = () => {
    try {
      const obj = JSON.parse(texte);
      setMeta({
        id: obj.id ?? "",
        title: obj.title ?? "",
        description: obj.description ?? "",
        department: obj.department ?? "",
        level: obj.level ?? "",
        school: obj.school ?? Object.keys(schoolsData)[0],
      });
      setOpen(true);
    } catch {
      // ignore
    }
  };

  const sauvegarderMeta = () => {
    if (!meta) return;
    try {
      const obj = JSON.parse(texte || "{}");
      const newObj = { ...obj, ...meta, id: generateId(meta.title, meta.department, meta.level, meta.school) };
      const pretty = JSON.stringify(newObj, null, 2);
      setTexte(pretty);
      setEstValide(true);
      setOpen(false);
    } catch {
      // ignore parse error
    }
  };

  useEffect(() => {
    if (!meta) return;
    const data = schoolsData[meta.school];
    if (!data) return;
    if (!data.departments.includes(meta.department)) {
      setMeta({ ...meta, department: data.departments[0] });
    }
    if (!data.levels.includes(meta.level)) {
      setMeta({ ...meta, level: data.levels[0] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta?.school]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-sky-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Éditer les métadonnées</DialogTitle>
          </DialogHeader>
          {meta && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-sm font-medium">ID</span>
                <Input value={meta.id} onChange={(e) => setMeta({ ...meta, id: e.target.value })} />
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium">Titre</span>
                <Input value={meta.title} onChange={(e) => setMeta({ ...meta, title: e.target.value })} />
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium">Description</span>
                <Textarea value={meta.description} onChange={(e) => setMeta({ ...meta, description: e.target.value })} className="h-24" />
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium">École</span>
                <Select value={meta.school} onValueChange={(v) => setMeta({ ...meta, school: v })}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="École" /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(schoolsData).map((ec) => <SelectItem key={ec} value={ec}>{ec}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-medium">Département</span>
                <Select value={meta.department} onValueChange={(v) => setMeta({ ...meta, department: v })}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Département" /></SelectTrigger>
                  <SelectContent>
                    {schoolsData[meta.school].departments.map((dep) => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-medium">Niveau</span>
                <Select value={meta.level} onValueChange={(v) => setMeta({ ...meta, level: v })}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Niveau" /></SelectTrigger>
                  <SelectContent>
                    {schoolsData[meta.school].levels.map((lvl) => <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFtr className="mt-4">
            <Button variant="secondary" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={sauvegarderMeta}>Enregistrer</Button>
          </DialogFtr>
        </DialogContent>
      </Dialog>

      {/* Main card */}
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>🧠 Révision QCM</CardTitle>
          <CardDescription>Validez votre QCM et téléchargez le au bon format</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea value={texte} onChange={(e) => { setTexte(e.target.value); setEstValide(null); }} placeholder="Collez votre JSON ici…" className="h-64" />
          
          {estValide !== null && <p className={`text-sm ${estValide ? "text-green-600" : "text-red-600"}`}>{estValide ? "JSON valide ✅" : "JSON invalide ❌"}</p>}
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button onClick={verifier}>Vérifier</Button>
          <Button variant="outline" onClick={ouvrirEdition} disabled={!estValide}>Éditer</Button>
          <Button variant="secondary" onClick={telecharger} disabled={!estValide}>Télécharger</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
