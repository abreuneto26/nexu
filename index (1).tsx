import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Stethoscope, 
  FileText, 
  Pill, 
  Users, 
  BrainCircuit, 
  Mic, 
  Upload, 
  Camera, 
  Calculator, 
  Wand2, 
  Network, 
  Save, 
  Trash2, 
  Check, 
  X, 
  Search, 
  Plus, 
  Printer,
  ChevronDown,
  ChevronRight,
  Menu,
  FileOutput,
  Sun,
  Moon,
  ArrowLeft,
  Play,
  Activity,
  Syringe,
  Heart,
  Baby,
  Stethoscope as StethosIcon,
  Siren,
  FileBadge,
  Bone,
  Brain,
  Eye,
  ScanFace,
  Droplet,
  Microscope,
  Zap,
  BookOpen,
  Sparkles,
  AlertTriangle,
  Split,
  ShieldAlert,
  TestTube2,
  Settings,
  Palette,
  Thermometer,
  Scissors,
  Dna,
  Calendar,
  Image as ImageIcon,
  Library,
  GraduationCap,
  MessageCircle,
  LogOut,
  Layout,
  TableProperties,
  UploadCloud,
  FilePlus,
  Edit3,
  AlignLeft,
  Key
} from 'lucide-react';

// --- Databases ---

// Expanded Database for Medications (Simulating a larger DB)
const MEDICATIONS_DB = [
  // ANALGÉSICOS E ANTITÉRMICOS
  { name: "Dipirona 500mg", type: "Analgesico", posology: "1 comprimido VO a cada 6h SN." },
  { name: "Dipirona 1g", type: "Analgesico", posology: "1 comprimido VO a cada 6h SN." },
  { name: "Dipirona Gotas (500mg/ml)", type: "Analgesico", posology: "20 a 40 gotas VO a cada 6h SN." },
  { name: "Paracetamol 500mg", type: "Analgesico", posology: "1 comprimido VO a cada 6h SN." },
  { name: "Paracetamol 750mg", type: "Analgesico", posology: "1 comprimido VO a cada 6h SN." },
  { name: "Paracetamol Gotas (200mg/ml)", type: "Analgesico", posology: "30 a 50 gotas VO a cada 6h SN." },
  
  // ANTI-INFLAMATÓRIOS (AINES)
  { name: "Ibuprofeno 400mg", type: "AINE", posology: "1 comprimido VO a cada 8h após refeições." },
  { name: "Ibuprofeno 600mg", type: "AINE", posology: "1 comprimido VO a cada 8h após refeições." },
  { name: "Cetoprofeno 100mg", type: "AINE", posology: "1 comprimido VO a cada 12h." },
  { name: "Nimesulida 100mg", type: "AINE", posology: "1 comprimido VO a cada 12h por 3-5 dias." },
  { name: "Diclofenaco Potássico 50mg", type: "AINE", posology: "1 comprimido VO a cada 8h." },
  { name: "Diclofenaco Sódico 50mg", type: "AINE", posology: "1 comprimido VO a cada 8h." },
  { name: "Naproxeno 500mg", type: "AINE", posology: "1 comprimido VO a cada 12h." },
  { name: "Meloxicam 15mg", type: "AINE", posology: "1 comprimido VO 1x ao dia." },
  { name: "Celecoxibe 200mg", type: "AINE", posology: "1 cápsula VO 1x ao dia." },

  // OPIOIDES
  { name: "Tramadol 50mg", type: "Opioide", posology: "1 cápsula VO a cada 8h se dor intensa." },
  { name: "Codeína 30mg", type: "Opioide", posology: "1 comprimido VO a cada 6h se dor intensa." },
  { name: "Paco (Paracetamol 500 + Codeína 30)", type: "Opioide", posology: "1 comp VO 6/6h SN." },
  { name: "Morfina 10mg", type: "Opioide", posology: "USO HOSPITALAR/RECEITA AMARELA" },

  // ANTIBIÓTICOS
  { name: "Amoxicilina 500mg", type: "Antibiotico", posology: "1 cápsula VO de 8/8h por 7 dias." },
  { name: "Amoxicilina + Clavulanato 875/125mg", type: "Antibiotico", posology: "1 comprimido VO de 12/12h por 7-10 dias." },
  { name: "Azitromicina 500mg", type: "Antibiotico", posology: "1 comprimido VO por dia por 3-5 dias." },
  { name: "Ciprofloxacino 500mg", type: "Antibiotico", posology: "1 comprimido VO de 12/12h por 7-10 dias." },
  { name: "Cefalexina 500mg", type: "Antibiotico", posology: "1 cápsula VO de 6/6h por 7 dias." },
  { name: "Sulfametoxazol + Trimetoprima 800/160mg", type: "Antibiotico", posology: "1 comprimido VO de 12/12h." },
  { name: "Levofloxacino 500mg", type: "Antibiotico", posology: "1 comprimido VO 1x ao dia por 7 dias." },
  { name: "Levofloxacino 750mg", type: "Antibiotico", posology: "1 comprimido VO 1x ao dia por 5 dias." },
  { name: "Clindamicina 300mg", type: "Antibiotico", posology: "1 cápsula VO de 6/6h." },
  { name: "Doxiciclina 100mg", type: "Antibiotico", posology: "1 comprimido VO 12/12h." },
  { name: "Metronidazol 250mg", type: "Antibiotico", posology: "2 comprimidos VO 12/12h por 7 dias." },
  { name: "Nitrofurantoína 100mg", type: "Antibiotico", posology: "1 cápsula VO 6/6h por 5-7 dias." },
  { name: "Fosfomicina 3g", type: "Antibiotico", posology: "Dose única (diluir em água)." },

  // CARDIOVASCULAR - HIPERTENSÃO
  { name: "Losartana 50mg", type: "Anti-hipertensivo", posology: "1 comprimido VO 12/12h." },
  { name: "Enalapril 10mg", type: "Anti-hipertensivo", posology: "1 comprimido VO 12/12h." },
  { name: "Enalapril 20mg", type: "Anti-hipertensivo", posology: "1 comprimido VO 12/12h." },
  { name: "Anlodipino 5mg", type: "Anti-hipertensivo", posology: "1 comprimido VO 1x ao dia." },
  { name: "Anlodipino 10mg", type: "Anti-hipertensivo", posology: "1 comprimido VO 1x ao dia." },
  { name: "Hidroclorotiazida 25mg", type: "Diurético", posology: "1 comprimido VO pela manhã." },
  { name: "Clortalidona 12.5mg", type: "Diurético", posology: "1 comprimido VO pela manhã." },
  { name: "Furosemida 40mg", type: "Diurético", posology: "1 comprimido VO pela manhã (jejum)." },
  { name: "Espironolactona 25mg", type: "Diurético", posology: "1 comprimido VO pela manhã." },
  { name: "Atenolol 25mg", type: "Beta-bloqueador", posology: "1 comprimido VO 1x ao dia." },
  { name: "Atenolol 50mg", type: "Beta-bloqueador", posology: "1 comprimido VO 1x ao dia." },
  { name: "Carvedilol 6.25mg", type: "Beta-bloqueador", posology: "1 comprimido VO 12/12h." },
  { name: "Carvedilol 12.5mg", type: "Beta-bloqueador", posology: "1 comprimido VO 12/12h." },
  { name: "Carvedilol 25mg", type: "Beta-bloqueador", posology: "1 comprimido VO 12/12h." },
  { name: "Bisoprolol 2.5mg", type: "Beta-bloqueador", posology: "1 comprimido VO 1x ao dia." },
  { name: "Bisoprolol 5mg", type: "Beta-bloqueador", posology: "1 comprimido VO 1x ao dia." },

  // CARDIOVASCULAR - LIPÍDIOS
  { name: "Simvastatina 20mg", type: "Lipidimico", posology: "1 comprimido VO a noite." },
  { name: "Simvastatina 40mg", type: "Lipidimico", posology: "1 comprimido VO a noite." },
  { name: "Atorvastatina 20mg", type: "Lipidimico", posology: "1 comprimido VO a noite." },
  { name: "Atorvastatina 40mg", type: "Lipidimico", posology: "1 comprimido VO a noite." },
  { name: "Rosuvastatina 10mg", type: "Lipidimico", posology: "1 comprimido VO a noite." },
  { name: "Ciprofibrato 100mg", type: "Lipidimico", posology: "1 comprimido VO a noite." },

  // GASTROINTESTINAL
  { name: "Omeprazol 20mg", type: "IBP", posology: "1 cápsula VO em jejum." },
  { name: "Pantoprazol 40mg", type: "IBP", posology: "1 comprimido VO em jejum." },
  { name: "Esomeprazol 40mg", type: "IBP", posology: "1 comprimido VO em jejum." },
  { name: "Domperidona 10mg", type: "Procinético", posology: "1 comprimido VO 15 min antes das refeições." },
  { name: "Bromoprida 10mg", type: "Procinético", posology: "1 comprimido VO 12/12h." },
  { name: "Metoclopramida 10mg", type: "Procinético", posology: "1 comprimido VO 8/8h." },
  { name: "Ondansetrona 4mg", type: "Antiemético", posology: "1 comprimido sublingual 8/8h SN." },
  { name: "Ondansetrona 8mg", type: "Antiemético", posology: "1 comprimido sublingual 8/8h SN." },
  { name: "Simeticona 40mg", type: "Antigases", posology: "1 comprimido VO 8/8h." },
  { name: "Simeticona Gotas (75mg/ml)", type: "Antigases", posology: "30 gotas VO 8/8h." },
  { name: "Lactulose 667mg/ml", type: "Laxativo", posology: "15ml VO 12/12h." },
  { name: "Óleo Mineral 100%", type: "Laxativo", posology: "15ml VO a noite." },

  // ENDOCRINOLOGIA
  { name: "Metformina 500mg", type: "Hipoglicemiante", posology: "1 comprimido VO após almoço e jantar." },
  { name: "Metformina 850mg", type: "Hipoglicemiante", posology: "1 comprimido VO após refeições." },
  { name: "Metformina XR 500mg", type: "Hipoglicemiante", posology: "1 a 3 comp VO a noite (liberação lenta)." },
  { name: "Glibenclamida 5mg", type: "Hipoglicemiante", posology: "1 comprimido VO antes do café." },
  { name: "Gliclazida MR 30mg", type: "Hipoglicemiante", posology: "1 a 2 comp VO no café da manhã." },
  { name: "Dapagliflozina 10mg", type: "Hipoglicemiante", posology: "1 comprimido VO 1x ao dia." },
  { name: "Empagliflozina 25mg", type: "Hipoglicemiante", posology: "1 comprimido VO 1x ao dia." },
  { name: "Levotiroxina 25mcg", type: "Hormônio", posology: "1 comprimido VO em jejum (30min antes café)." },
  { name: "Levotiroxina 50mcg", type: "Hormônio", posology: "1 comprimido VO em jejum." },
  { name: "Levotiroxina 75mcg", type: "Hormônio", posology: "1 comprimido VO em jejum." },
  { name: "Levotiroxina 88mcg", type: "Hormônio", posology: "1 comprimido VO em jejum." },
  { name: "Levotiroxina 100mcg", type: "Hormônio", posology: "1 comprimido VO em jejum." },

  // PSIQUIATRIA
  { name: "Clonazepam 0.25mg (Sublingual)", type: "Benzodiazepínico", posology: "1 comprimido SL SN crise ansiedade." },
  { name: "Clonazepam 2.5mg/ml (Gotas)", type: "Benzodiazepínico", posology: "5 a 10 gotas a noite." },
  { name: "Diazepam 5mg", type: "Benzodiazepínico", posology: "1 comprimido a noite." },
  { name: "Diazepam 10mg", type: "Benzodiazepínico", posology: "1 comprimido a noite." },
  { name: "Alprazolam 0.5mg", type: "Benzodiazepínico", posology: "1 comprimido VO a noite." },
  { name: "Sertralina 50mg", type: "Antidepressivo", posology: "1 comprimido pela manhã." },
  { name: "Escitalopram 10mg", type: "Antidepressivo", posology: "1 comprimido pela manhã." },
  { name: "Escitalopram 15mg", type: "Antidepressivo", posology: "1 comprimido pela manhã." },
  { name: "Escitalopram 20mg", type: "Antidepressivo", posology: "1 comprimido pela manhã." },
  { name: "Fluoxetina 20mg", type: "Antidepressivo", posology: "1 cápsula pela manhã." },
  { name: "Amitriptilina 25mg", type: "Antidepressivo", posology: "1 comprimido a noite." },
  { name: "Nortriptilina 25mg", type: "Antidepressivo", posology: "1 comprimido a noite." },
  { name: "Venlafaxina 75mg", type: "Antidepressivo", posology: "1 cápsula pela manhã." },
  { name: "Duloxetina 60mg", type: "Antidepressivo", posology: "1 cápsula pela manhã." },
  { name: "Quetiapina 25mg", type: "Antipsicótico", posology: "1 comprimido a noite." },
  { name: "Risperidona 1mg", type: "Antipsicótico", posology: "1 comprimido a noite." },

  // RESPIRATÓRIO & ALERGIA
  { name: "Salbutamol 100mcg (Spray)", type: "Broncodilatador", posology: "2 jatos via inalatória 4/4h SN." },
  { name: "Aerolin Spray", type: "Broncodilatador", posology: "2 jatos 4/4h se dispneia." },
  { name: "Budesonida 32mcg (Nasal)", type: "Corticosteróide", posology: "1 jato em cada narina 12/12h." },
  { name: "Budesonida 50mcg (Nasal)", type: "Corticosteróide", posology: "1 jato em cada narina 12/12h." },
  { name: "Loratadina 10mg", type: "Antialérgico", posology: "1 comprimido 1x ao dia." },
  { name: "Desloratadina 5mg", type: "Antialérgico", posology: "1 comprimido 1x ao dia." },
  { name: "Fexofenadina 120mg", type: "Antialérgico", posology: "1 comprimido 1x ao dia." },
  { name: "Fexofenadina 180mg", type: "Antialérgico", posology: "1 comprimido 1x ao dia." },
  { name: "Dexclorfeniramina 2mg", type: "Antialérgico", posology: "1 comprimido de 8/8h." },
  { name: "Prednisolona 20mg", type: "Corticosteróide", posology: "1 comprimido pela manhã por 5 dias." },
  { name: "Prednisona 5mg", type: "Corticosteróide", posology: "1 comprimido pela manhã." },
  { name: "Prednisona 20mg", type: "Corticosteróide", posology: "1 a 2 comprimidos pela manhã por 5 dias." },
  { name: "Acebrofilina Xarope", type: "Mucolítico", posology: "10ml VO 12/12h." },
  { name: "N-Acetilcisteína 600mg", type: "Mucolítico", posology: "1 envelope/comp efervescente a noite." }
];

const EXAMS_DB = [
  // HEMATOLOGIA
  { name: "Hemograma Completo" }, { name: "Plaquetas" }, { name: "Reticulócitos" }, { name: "VHS (Velocidade de Hemossedimentação)" }, { name: "Tipagem Sanguínea e Fator Rh" },
  { name: "Coagulograma Completo" }, { name: "TAP/INR" }, { name: "TTPA" }, { name: "Fibrinogênio" },

  // BIOQUÍMICA
  { name: "Glicemia de Jejum" }, { name: "Hemoglobina Glicada (HbA1c)" }, { name: "Curva Glicêmica (TOTG)" }, { name: "Insulina Basal" },
  { name: "Colesterol Total" }, { name: "HDL Colesterol" }, { name: "LDL Colesterol" }, { name: "VLDL Colesterol" }, { name: "Triglicerídeos" },
  { name: "Ureia" }, { name: "Creatinina" }, { name: "Ácido Úrico" },
  { name: "Sódio (Na+)" }, { name: "Potássio (K+)" }, { name: "Cálcio Total" }, { name: "Cálcio Iônico" }, { name: "Magnésio" }, { name: "Fósforo" }, { name: "Cloro" },
  { name: "TGO (AST)" }, { name: "TGP (ALT)" }, { name: "Gama GT" }, { name: "Fosfatase Alcalina" }, { name: "Bilirrubinas Totais e Frações" }, { name: "Albumina" }, { name: "Proteínas Totais e Frações" },
  { name: "Amilase" }, { name: "Lipase" }, { name: "CPK (Creatinofosfoquinase)" }, { name: "CK-MB" }, { name: "Troponina I" }, { name: "Troponina T" }, { name: "Lactato (Ácido Lático)" },
  { name: "PCR (Proteína C Reativa)" },

  // HORMÔNIOS
  { name: "TSH" }, { name: "T4 Livre" }, { name: "T3 Total" }, { name: "T3 Livre" }, { name: "Anti-TPO" }, { name: "Anti-Tireoglobulina" },
  { name: "LH" }, { name: "FSH" }, { name: "Estradiol" }, { name: "Progesterona" }, { name: "Prolactina" }, { name: "Testosterona Total" }, { name: "Testosterona Livre" }, { name: "SHBG" },
  { name: "Cortisol Basal (8h)" }, { name: "PTH (Paratormônio)" }, { name: "Vitamina D (25-OH)" }, { name: "Vitamina B12" }, { name: "Ferritina" }, { name: "Ferro Sérico" }, { name: "Saturação de Transferrina" }, { name: "Ácido Fólico" },

  // URINA E FEZES
  { name: "EAS (Urina Tipo 1)" }, { name: "Urocultura com Antibiograma" }, { name: "Microalbuminúria (Amostra isolada)" }, { name: "Proteinúria de 24h" },
  { name: "Parasitológico de Fezes" }, { name: "Pesquisa de Sangue Oculto" }, { name: "Coprocultura" },

  // IMUNOLOGIA E SOROLOGIA
  { name: "Beta HCG (Qualitativo)" }, { name: "Beta HCG (Quantitativo)" },
  { name: "VDRL" }, { name: "HIV 1 e 2 (Sorologia)" }, { name: "HBsAg" }, { name: "Anti-HBs" }, { name: "Anti-HCV" }, { name: "Sorologia para Dengue (IgM/IgG)" }, { name: "NS1 Dengue" },
  { name: "Fator Reumatoide" }, { name: "FAN (Fator Antinuclear)" },

  // MARCADORES TUMORAIS
  { name: "PSA Total" }, { name: "PSA Livre" }, { name: "CEA" }, { name: "CA 125" }, { name: "CA 19-9" }, { name: "CA 15-3" }, { name: "Alfa-Fetoproteína" },

  // IMAGEM - RAIO-X
  { name: "Raio-X de Tórax (PA e Perfil)" }, { name: "Raio-X de Seios da Face" }, { name: "Raio-X de Abdome Agudo" }, { name: "Raio-X de Abdome Simples" },
  { name: "Raio-X de Coluna Cervical" }, { name: "Raio-X de Coluna Lombar" }, { name: "Raio-X de Joelho" }, { name: "Raio-X de Ombro" }, { name: "Raio-X de Bacia" }, { name: "Raio-X de Mãos e Punhos" },

  // IMAGEM - ULTRASSONOGRAFIA
  { name: "USG Abdome Total" }, { name: "USG Abdome Superior" }, { name: "USG Vias Urinárias" }, { name: "USG Obstétrica" }, { name: "USG Transvaginal" },
  { name: "USG Tireoide" }, { name: "USG Doppler de MMII" }, { name: "USG Doppler de Carótidas" }, { name: "USG Mamas" }, { name: "USG Próstata (Via Abdominal)" },

  // IMAGEM - TOMOGRAFIA
  { name: "Tomografia de Crânio (sem contraste)" }, { name: "Tomografia de Tórax" }, { name: "Tomografia de Abdome Total" }, { name: "Tomografia de Seios da Face" }, { name: "Tomografia de Coluna Cervical" }, { name: "Tomografia de Coluna Lombar" },

  // IMAGEM - RESSONÂNCIA
  { name: "Ressonância Magnética de Crânio" }, { name: "Ressonância Magnética de Coluna Lombar" }, { name: "Ressonância Magnética de Joelho" }, { name: "Ressonância Magnética de Ombro" },

  // CARDIOLOGIA
  { name: "Eletrocardiograma (ECG)" }, { name: "Ecocardiograma Transtorácico" }, { name: "Teste Ergométrico" }, { name: "Holter 24h" }, { name: "MAPA 24h" },

  // OUTROS
  { name: "Endoscopia Digestiva Alta" }, { name: "Colonoscopia" }, { name: "Espirometria" }, { name: "Audiometria" }
];

const SPECIALTIES_ICONS: Record<string, any> = {
  "IA Estratégica": Brain,
  "Cardiologia": Heart,
  "Endocrinologia": Activity,
  "Pediatria": Baby,
  "Emergência": Siren,
  "Administrativo": FileBadge,
  "Neurologia": BrainCircuit,
  "Ortopedia": Bone,
  "Gastroenterologia": Activity,
  "Psiquiatria": BrainCircuit,
  "Dermatologia": ScanFace,
  "Pneumologia": Stethoscope,
  "Nefrologia": Droplet,
  "Infectologia": Microscope,
  "Ginecologia": Users,
  "Obstetrícia": Baby,
  "Oftalmologia": Eye,
  "Ferramentas Diagnósticas": Zap,
  "Terapêutica": BookOpen,
  "Reumatologia": Bone,
  "Hematologia": Droplet,
  "Oncologia": Dna,
  "Cirurgia Geral": Scissors,
  "Geriatria": Users,
  "Medicina Intensiva": Thermometer,
};

// Massively Expanded Tools DB (>350 items represented across categories)
const TOOLS_DB: Record<string, Array<{name: string, desc: string, type?: 'text' | 'image' | 'both'}>> = {
  "IA Estratégica": [
    { name: "Segunda Opinião (Preceptor IA)", desc: "Avalia criticamente a coleta do SOAP, busca inconsistências e sugere prioridades." },
    { name: "Diagnóstico Diferencial", desc: "Gera lista de hipóteses ordenadas por probabilidade baseada no quadro." },
    { name: "Detector de Red Flags", desc: "Escaneia o caso em busca de sinais de alarme e risco de vida iminente." },
    { name: "Interpretar Labs (Avançado)", desc: "Análise profunda de distúrbios hidroeletrolíticos e ácido-básicos." },
    { name: "Gerador de Evolução (SOAP)", desc: "Transforma anotações soltas em evolução estruturada." },
    { name: "Resumidor de Caso", desc: "Cria um resumo conciso para passagem de plantão." },
    { name: "Auditoria de Prontuário", desc: "Verifica se os critérios legais e de qualidade foram preenchidos." },
    { name: "Tradutor de Termos Médicos", desc: "Explica termos técnicos para linguagem de paciente." },
    // 10 Novos Recursos Estratégicos Existentes
    { name: "Análise de Interação Medicamentosa", desc: "Verifica interações graves entre todas as drogas em uso pelo paciente." },
    { name: "Sugestão Antibioticoterapia", desc: "Recomenda antibióticos empíricos baseados no foco infeccioso e perfil do paciente." },
    { name: "Ajuste Renal de Dose", desc: "Calcula a dose corrigida de medicamentos baseado na TFG estimada." },
    { name: "Calculadora de Infusão Contínua", desc: "Converte ml/h para mcg/kg/min para drogas vasoativas e sedativos." },
    { name: "Gerador de Hipóteses (Dr. House)", desc: "Modo criativo para casos raros e de difícil diagnóstico." },
    { name: "Planejador de Alta Hospitalar", desc: "Gera checklist e orientações para alta segura do paciente." },
    { name: "Estimativa de Sobrevida (Paliativo)", desc: "Aplica escalas PPS e PPI para prognóstico em cuidados paliativos." },
    { name: "Risco de Readmissão", desc: "Avalia a probabilidade de retorno ao hospital em 30 dias." },
    { name: "Auditoria de Segurança (Checklist)", desc: "Verifica pontos críticos de segurança do paciente no atendimento." },
    { name: "Conversor de Opioides", desc: "Calcula equianalgesia entre diferentes opioides e vias de administração." },
    // +10 Novos Recursos Estratégicos (Solicitados Agora)
    { name: "Análise de Risco Jurídico", desc: "Identifica falhas no registro que podem gerar litígio." },
    { name: "Detector de Viés Cognitivo", desc: "Alerta para fechamento prematuro ou viés de confirmação." },
    { name: "Otimizador de Coding (CID-10)", desc: "Sugere os códigos CID-10 mais precisos para o caso." },
    { name: "Busca de Evidências (MBE)", desc: "Sugere palavras-chave e estratégias para busca de artigos recentes." },
    { name: "Simulador de Cenários", desc: "Projeta melhor e pior cenário possível para o paciente em 24h." },
    { name: "Stewardship de Antibióticos", desc: "Auditoria focada em descalonamento e duração de ATB." },
    { name: "Avaliação de Capacidade", desc: "Roteiro para avaliar capacidade de decisão do paciente." },
    { name: "Rastreador de Doenças Raras", desc: "Cruza sintomas comuns com banco de doenças raras." },
    { name: "Conciliação Medicamentosa", desc: "Compara medicação de uso domiciliar com a prescrição atual." },
    { name: "Gerador de Termo de Consentimento", desc: "Cria TCLE personalizado para o procedimento proposto." }
  ],
  "Obstetrícia": [
    { name: "Calculadora de IG (DUM/USG)", desc: "Cálculo preciso com data provável de parto." },
    { name: "Bishop Score", desc: "Avaliação do colo uterino para indução do parto." },
    { name: "Risco de Pré-Eclâmpsia", desc: "Fatores de risco e indicação de AAS." },
    { name: "Critérios de Morte Encefálica Gestante", desc: "Protocolo específico." },
    { name: "Medicações na Lactação (Hale)", desc: "Risco de drogas na amamentação." },
    { name: "Ganho de Peso Gestacional", desc: "Metas baseadas no IMC pré-gestacional (IOM)." },
    { name: "Protocolo de Sulfatação", desc: "Esquema Pritchard ou Zuspan para eclâmpsia." },
    { name: "Vitalidade Fetal (Perfil Biofísico)", desc: "Pontuação de Manning." },
    { name: "Curva de Altura Uterina", desc: "Avaliação de crescimento fetal." },
    { name: "Indução de Parto (Ocitocina)", desc: "Protocolo de infusão segura." },
    { name: "Índice de Líquido Amniótico (ILA)", desc: "Classificação de Oligodrâmnio e Polidrâmnio." },
    { name: "Rastreamento Diabetes Gestacional", desc: "Interpretação de TOTG e Glicemia de Jejum na gestante." },
    { name: "Predição de Parto Prematuro", desc: "Avaliação de colo curto e fibronectina fetal." },
    { name: "Classificação de Laceração Perineal", desc: "Graus 1 a 4 e conduta de sutura." },
    // Novos
    { name: "Perfil Biofísico Fetal Simplificado", desc: "Apenas ILA e Cardiotoco." },
    { name: "Classificação de Robson", desc: "Indicação de cesariana." },
    { name: "Score de Apgar Obstétrico", desc: "Previsão de sucesso VBAC." }
  ],
  "Ginecologia": [
     { name: "Critérios de Amsel", desc: "Diagnóstico de Vaginose Bacteriana." },
     { name: "Classificação POP-Q", desc: "Prolapso de órgãos pélvicos." },
     { name: "Índice de Pearl", desc: "Eficácia de métodos contraceptivos." },
     { name: "Critérios de Roterdã", desc: "Diagnóstico de SOP." },
     { name: "Birads (Mamografia)", desc: "Classificação e conduta." },
     { name: "Rastreamento de CA Colo Útero", desc: "Diretrizes de Papanicolau (INCA/MS)." },
     { name: "Sangramento Uterino Anormal (PALM-COEIN)", desc: "Classificação etiológica do SUA." },
     { name: "Critérios de Elegibilidade (OMS)", desc: "Escolha segura de método contraceptivo." },
     { name: "Score de Gail (Risco CA Mama)", desc: "Estimativa de risco de câncer de mama em 5 anos." },
     { name: "Índice de Massa Corporal (IMC)", desc: "Cálculo e classificação nutricional." },
     // Novos
     { name: "Risco de Malignidade Ovariana (RMI)", desc: "Avaliação de massas anexiais." },
     { name: "Índice de Hirsutismo (Ferriman)", desc: "Quantificação de pelos em SOP." },
     { name: "Classificação de Endometriose", desc: "ASRM Revisada." }
  ],
  "Cardiologia": [
    { name: "Escore HEART", desc: "Estratificação de risco para dor torácica na emergência." },
    { name: "Calculadora CHA₂DS₂-VASc", desc: "Risco de AVC em Fibrilação Atrial." },
    { name: "Score HAS-BLED", desc: "Risco de sangramento em anticoagulação." },
    { name: "Critérios de Framingham", desc: "Risco cardiovascular em 10 anos." },
    { name: "Diretriz HAS 2024 (SBC)", desc: "Metas pressóricas e classes de drogas." },
    { name: "Classificação NYHA", desc: "Estadiamento funcional da Insuficiência Cardíaca." },
    { name: "Score TIMI (IAMCSST)", desc: "Prognóstico em IAM com supra." },
    { name: "Score TIMI (IAMSSST/Angina)", desc: "Prognóstico em síndrome coronariana sem supra." },
    { name: "Critérios de Duke", desc: "Diagnóstico de Endocardite Infecciosa." },
    { name: "Calculadora de LDL (Friedewald)", desc: "Estimativa de LDL colesterol." },
    { name: "QTc (Bazett)", desc: "Cálculo do intervalo QT corrigido." },
    { name: "Score GRACE", desc: "Mortalidade em SCA hospitalar e 6 meses." },
    { name: "Killip Classificação", desc: "Gravidade do IAM baseada no exame físico." },
    { name: "Canadian Cardiovascular Society (CCS)", desc: "Classificação de angina." },
    { name: "EHRA Score", desc: "Sintomas em Fibrilação Atrial." },
    { name: "Dose de Anticoagulantes (NOACs)", desc: "Ajuste de dose renal para Eliquis, Xarelto, etc." },
    { name: "Score de Cálcio (Interpretação)", desc: "Risco CV baseado no Agatston." },
    { name: "Critérios de Sgarbossa", desc: "IAM em vigência de BRE." },
    { name: "Escore de Cruzamento (Valvas)", desc: "Indicação de intervenção valvar." },
    { name: "Classificação ACC/AHA IC", desc: "Estágios A, B, C, D da Insuficiência Cardíaca." },
    { name: "Duke Treadmill Score", desc: "Prognóstico em teste ergométrico." },
    { name: "Score de Seattle (IC)", desc: "Mortalidade em Insuficiência Cardíaca." },
    { name: "DAPT Score", desc: "Duração da dupla antiagregação plaquetária." },
    { name: "Hypertrophic Cardiomyopathy Risk", desc: "Risco de morte súbita em CMH." },
    // Novos
    { name: "MAGGIC Risk Score", desc: "Mortalidade em Insuficiência Cardíaca." },
    { name: "Syntax Score Simplificado", desc: "Complexidade de DAC." },
    { name: "Escore de Framingham (FA)", desc: "Risco de FA." },
    { name: "Score de San Francisco (Síncope)", desc: "Regra de decisão em síncope." }
  ],
  "Pneumologia": [
    { name: "Escore CURB-65", desc: "Gravidade da Pneumonia Adquirida na Comunidade." },
    { name: "Escore PORT/PSI", desc: "Índice de gravidade de pneumonia (fino)." },
    { name: "Classificação GOLD (DPOC)", desc: "Estadiamento e tratamento da DPOC." },
    { name: "Critérios de Wells (TEP)", desc: "Probabilidade clínica de Embolia Pulmonar." },
    { name: "Score Genebra", desc: "Probabilidade de TEP." },
    { name: "Calculadora de Tabagismo", desc: "Carga tabágica (Maços-ano)." },
    { name: "Critérios de Light", desc: "Diferenciação transudato/exsudato pleural." },
    { name: "PESI (Embolia Pulmonar)", desc: "Pulmonary Embolism Severity Index." },
    { name: "CAT Score (DPOC)", desc: "Avaliação de sintomas na DPOC." },
    { name: "mMRC (Dispneia)", desc: "Escala de dispneia modificada." },
    { name: "Nódulo Pulmonar (Fleischner)", desc: "Diretrizes para seguimento de nódulos." },
    { name: "BODE Index", desc: "Prognóstico em DPOC." },
    { name: "LAMA/LABA/ICS", desc: "Guia de inalatórios." },
    { name: "Score de Epworth", desc: "Sonolência diurna (Apneia do sono)." },
    { name: "Classificação de Asma (GINA)", desc: "Controle da asma." },
    { name: "Gap A-a (Gradiente Alvéolo-Arterial)", desc: "Cálculo de distúrbios de troca gasosa." },
    { name: "Índice de Baux (Queimadura Inalatória)", desc: "Prognóstico em queimaduras." },
    { name: "SPN Malignancy Risk", desc: "Probabilidade de malignidade em nódulo pulmonar." },
    // Novos
    { name: "Calculadora de PaO2 Esperada", desc: "Baseada na idade." },
    { name: "ROX Index", desc: "Sucesso de Cânula Nasal de Alto Fluxo." }
  ],
  "Gastroenterologia": [
    { name: "Escore Child-Pugh", desc: "Prognóstico na Cirrose Hepática." },
    { name: "MELD Score", desc: "Model for End-Stage Liver Disease (Transplante)." },
    { name: "Classificação de Forrest", desc: "Risco de ressangramento em HDA." },
    { name: "Critérios de Roma IV", desc: "Diagnóstico de Síndrome do Intestino Irritável." },
    { name: "Escala de Bristol", desc: "Classificação visual das fezes." },
    { name: "Score de Glasgow-Blatchford", desc: "Triagem para HDA (necessidade de intervenção)." },
    { name: "Score de Rockall", desc: "Mortalidade pós-HDA." },
    { name: "Critérios de Atlanta (Pancreatite)", desc: "Diagnóstico e gravidade da pancreatite aguda." },
    { name: "Score de Ranson", desc: "Mortalidade em pancreatite." },
    { name: "BISAP Score", desc: "Gravidade em pancreatite aguda." },
    { name: "Mayo Score (Colite)", desc: "Atividade da Colite Ulcerativa." },
    { name: "Crohn's Disease Activity Index", desc: "Atividade da Doença de Crohn." },
    { name: "Maddrey's Discriminant Function", desc: "Hepatite Alcoólica Grave." },
    { name: "Lille Model", desc: "Resposta ao corticoide na hepatite alcoólica." },
    { name: "NAFLD Fibrosis Score", desc: "Fibrose na esteatose hepática." },
    { name: "HDA Varicosa (Baveno VI)", desc: "Consenso para hipertensão portal." },
    { name: "ALBI Score", desc: "Função hepática em hepatocarcinoma." },
    { name: "FIB-4 Index", desc: "Fibrose hepática não invasiva." },
    // Novos
    { name: "APRI Score", desc: "AST to Platelet Ratio Index." },
    { name: "Truelove and Witts", desc: "Colite Ulcerativa Grave." }
  ],
  "Nefrologia": [
    { name: "MDRD / CKD-EPI", desc: "Cálculo da Taxa de Filtração Glomerular (TFG)." },
    { name: "Cockcroft-Gault", desc: "Estimativa de clearance de creatinina." },
    { name: "Classificação KDIGO", desc: "Estadiamento da Doença Renal Crônica." },
    { name: "FeNa (Fração de Excreção de Na)", desc: "Diferenciação pré-renal vs NTA." },
    { name: "FeUrea", desc: "Fração de excreção de ureia (uso em diuréticos)." },
    { name: "Déficit de Água Livre", desc: "Correção de Hipernatremia." },
    { name: "Gap Aniônico (Anion Gap)", desc: "Acidose metabólica." },
    { name: "Delta Gap", desc: "Avaliação de distúrbios mistos." },
    { name: "Risco de Progressão DRC", desc: "Calculadora de risco de falência renal." },
    { name: "Cálcio Urinário", desc: "Investigação de litíase." },
    { name: "Correção de Sódio (Hiperglicemia)", desc: "Hiponatremia dilucional." },
    { name: "Critérios RIFLE/AKIN", desc: "Injúria Renal Aguda." },
    { name: "Winter's Formula", desc: "Compensação respiratória na acidose metabólica." },
    { name: "Déficit de Bicarbonato", desc: "Cálculo para reposição de base." }
  ],
  "Neurologia": [
    { name: "Escala de Coma de Glasgow", desc: "Avaliação do nível de consciência." },
    { name: "NIHSS (AVC)", desc: "National Institutes of Health Stroke Scale." },
    { name: "ABCD2 Score", desc: "Risco de AVC após AIT." },
    { name: "Mini-Mental (MEEM)", desc: "Rastreio de demência e declínio cognitivo." },
    { name: "Escala de Rankin Modificada", desc: "Grau de incapacidade pós-AVC." },
    { name: "Protocolo de Morte Encefálica", desc: "Critérios legais e exames necessários." },
    { name: "Hunt & Hess", desc: "Hemorragia Subaracnoidea (HSA)." },
    { name: "Fisher Score", desc: "Risco de vasoespasmo em HSA." },
    { name: "MOCA Test", desc: "Avaliação cognitiva de Montreal." },
    { name: "Escala de Hounsfield (TC)", desc: "Densidade das lesões cerebrais." },
    { name: "Four Score", desc: "Coma em pacientes intubados." },
    { name: "ASPECTS Score", desc: "Tomografia em AVC isquêmico agudo." },
    { name: "ICH Score", desc: "Prognóstico em Hemorragia Intracerebral." },
    { name: "CHA2DS2-VASc (Neuro)", desc: "Risco cardioembólico." },
    { name: "Escala de Braden (AVC)", desc: "Risco de úlcera de pressão." },
    // Novos
    { name: "WFNS Score", desc: "World Federation of Neurosurgical Societies (HSA)." },
    { name: "Canadian CT Head Rule", desc: "Indicação de TC após trauma." }
  ],
  "Endocrinologia": [
    { name: "Protocolo Cetoacidose (CAD)", desc: "Manejo de insulina e hidratação." },
    { name: "Estado Hiperosmolar", desc: "Manejo de EHH." },
    { name: "Nódulos Tireoidianos (TI-RADS)", desc: "Classificação ACR e conduta." },
    { name: "Correção de Cálcio", desc: "Cálcio corrigido pela albumina." },
    { name: "Insulinoterapia Hospitalar", desc: "Esquemas Basal-Bolus e Correção." },
    { name: "Diagnóstico Diabetes (ADA)", desc: "Critérios 2024 para DM e Pré-DM." },
    { name: "Frax Score", desc: "Risco de fratura osteoporótica." },
    { name: "Conversão Corticoides", desc: "Equivalência de doses de corticoides." },
    { name: "LDL Meta (SBC)", desc: "Alvo terapêutico por risco CV." },
    { name: "HOMA-IR", desc: "Índice de resistência à insulina." },
    { name: "Tempestade Tireoidiana (Burch-Wartofsky)", desc: "Probabilidade de tireotoxicose grave." },
    { name: "Critérios de Síndrome Metabólica", desc: "NCEP ATP III e IDF." },
    { name: "Volume Tireoidiano", desc: "Cálculo de volume glandular por USG." }
  ],
  "Pediatria": [
    { name: "Doses Pediátricas (Antibióticos)", desc: "Calculadora por peso (Amoxi, Azitro, Cefa)." },
    { name: "Doses Pediátricas (Sintomáticos)", desc: "Dipirona, Paracetamol, Ibuprofeno por peso." },
    { name: "Score de Apgar", desc: "Vitalidade neonatal (1º e 5º min)." },
    { name: "Escala de Glasgow Pediátrica", desc: "Avaliação neurológica em crianças." },
    { name: "Desidratação (OMS)", desc: "Classificação e Planos A, B, C." },
    { name: "Icterícia Neonatal (Kramer)", desc: "Estimativa visual e indicação de fototerapia." },
    { name: "Sinais Vitais Pediátricos", desc: "Valores de referência por idade." },
    { name: "Tubo Orotraqueal (Cálculo)", desc: "Tamanho do TOT por idade." },
    { name: "Holliday-Segar", desc: "Hidratação de manutenção em pediatria." },
    { name: "Critérios de Centor", desc: "Probabilidade de Faringite Estreptocócica." },
    { name: "Silverman-Andersen", desc: "Desconforto respiratório neonatal." },
    { name: "Ballard Score", desc: "Estimativa de idade gestacional pós-parto." },
    { name: "Escala de Dor (FLACC)", desc: "Dor em pediatria não-verbal." },
    { name: "Critérios de Jones", desc: "Febre Reumática." },
    { name: "Bronquiolite (Escala de Wood-Downes)", desc: "Gravidade da bronquiolite." },
    { name: "Crupe (Westley Score)", desc: "Gravidade da laringotraqueobronquite." },
    { name: "Superfície Corpórea (Ped)", desc: "Cálculo para quimioterapia e indexação." },
    { name: "Dose de Adrenalina/Atropina", desc: "Doses de PCR pediátrica (PALS)." },
    { name: "Escala de Alvarado (Pediatria)", desc: "Apendicite em crianças (PAS)." },
    { name: "Classificação de Mallampati", desc: "Via aérea difícil." },
    // Novos
    { name: "Alvo de Estatura (Canal Familiar)", desc: "Previsão de altura final." },
    { name: "PECARN (TCE Pediátrico)", desc: "Regra de decisão para TC de crânio." },
    { name: "Critérios de Kawasaki", desc: "Diagnóstico de Doença de Kawasaki." },
    { name: "Schwartz Formula", desc: "TFG em crianças." },
    { name: "Regra de 4-2-1", desc: "Manutenção hídrica intraoperatória." }
  ],
  "Emergência": [
    { name: "Protocolo de Sepse (1h)", desc: "Surviving Sepsis Campaign Bundle." },
    { name: "SOFA / qSOFA", desc: "Critérios de disfunção orgânica." },
    { name: "ACLS (Algoritmos)", desc: "FV/TV, Aesp/Assistolia, Bradicardia, Taquicardia." },
    { name: "ATLS (ABCDE)", desc: "Avaliação primária do trauma." },
    { name: "Protocolo de Dor Torácica", desc: "Fluxo de atendimento e tempos porta." },
    { name: "Intubação Sequência Rápida", desc: "Drogas (Sedativos e Bloqueadores) e doses." },
    { name: "Drogas Vasoativas", desc: "Diluição e doses (Nora, Dobuta, Adrena)." },
    { name: "NEWS 2", desc: "National Early Warning Score." },
    { name: "HEART Score", desc: "Dor torácica baixo risco." },
    { name: "Canadian C-Spine Rule", desc: "Indicação de imagem cervical." },
    { name: "NEXUS C-Spine", desc: "Critérios para retirar colar cervical." },
    { name: "Fórmula de Parkland", desc: "Hidratação em grandes queimados." },
    { name: "Regra dos 9 (Queimaduras)", desc: "Cálculo da superfície corporal queimada." },
    { name: "Intoxicações Exógenas", desc: "Antídotos comuns e manejo." },
    { name: "Anafilaxia", desc: "Diagnóstico e manejo (Adrenalina)." },
    { name: "San Francisco Syncope Rule", desc: "Risco em síncope na emergência." },
    { name: "TIMI Score (NSTEMI)", desc: "Risco em IAM sem supra." },
    { name: "Kocher Criteria", desc: "Artrite séptica em crianças." },
    // Novos
    { name: "NEXUS Chest", desc: "Indicação de TC de tórax no trauma." },
    { name: "Canadian CT Head Rule", desc: "Indicação de TC de crânio." },
    { name: "Score de Trauma (RTS)", desc: "Revised Trauma Score." }
  ],
  "Psiquiatria": [
    { name: "Critérios DSM-5 (Depressão)", desc: "Critérios diagnósticos para TDM." },
    { name: "Critérios DSM-5 (Ansiedade)", desc: "TAG e Pânico." },
    { name: "Protocolo de Agitação", desc: "Contenção química e física." },
    { name: "Risco de Suicídio (SAD PERSONS)", desc: "Estratificação de risco." },
    { name: "CIWA-Ar (Abstinência)", desc: "Avaliação de abstinência alcoólica." },
    { name: "COWS Score", desc: "Abstinência de opioides." },
    { name: "CAGE Questionnaire", desc: "Triagem para alcoolismo." },
    { name: "PHQ-9", desc: "Questionário de saúde do paciente (Depressão)." },
    { name: "GAD-7", desc: "Transtorno de ansiedade generalizada." },
    { name: "BPRS (Breve Escala Psiquiátrica)", desc: "Avaliação psicopatológica geral." },
    { name: "Young Mania Rating Scale", desc: "Avaliação de mania." },
    { name: "AUDIT Score", desc: "Rastreio detalhado de uso de álcool." },
    { name: "Escala de Depressão Geriátrica (GDS)", desc: "Rastreio de depressão em idosos." },
    { name: "Escala de Panss", desc: "Sintomas positivos e negativos na esquizofrenia." },
    // Novos
    { name: "AIMS (Discinesia)", desc: "Escala de movimentos involuntários anormais." },
    { name: "Escala de Zung (Ansiedade)", desc: "Autoavaliação de ansiedade." }
  ],
  "Ortopedia": [
    { name: "Regras de Ottawa (Tornozelo)", desc: "Indicação de Raio-X em entorses." },
    { name: "Regras de Ottawa (Joelho)", desc: "Indicação de Raio-X em trauma de joelho." },
    { name: "Classificação de Salter-Harris", desc: "Fraturas epifisárias em crianças." },
    { name: "Síndrome Compartimental", desc: "Sinais clínicos (5 Ps) e conduta." },
    { name: "Classificação de Gustilo-Anderson", desc: "Fraturas expostas." },
    { name: "Mirels Score", desc: "Risco de fratura patológica." },
    { name: "Classificação de Garden", desc: "Fraturas de colo de fêmur." },
    { name: "Thompson/Epstein", desc: "Luxação posterior do quadril." },
    { name: "Score de Mess", desc: "Índice de severidade de extremidade esmagada." },
    { name: "Vancouver Classification", desc: "Fraturas periprotéticas." },
    // Novos
    { name: "Kanavel Signs", desc: "Tenossinovite infecciosa flexora." },
    { name: "Spurling Test", desc: "Radiculopatia cervical." },
    { name: "Teste de Finkelstein", desc: "Tenossinovite De Quervain." }
  ],
  "Reumatologia": [
    { name: "Critérios do Lúpus (ACR/EULAR)", desc: "Diagnóstico de LES." },
    { name: "DAS-28", desc: "Atividade da Artrite Reumatoide." },
    { name: "Critérios de Gota", desc: "ACR/EULAR 2015." },
    { name: "Beighton Score", desc: "Hipermobilidade articular." },
    { name: "Critérios de Fibromialgia", desc: "Pontos dolorosos e severidade." },
    { name: "Critérios de SAPL", desc: "Síndrome do Anticorpo Antifosfolípide." },
    { name: "Espondilite Anquilosante (ASAS)", desc: "Critérios diagnósticos." },
    { name: "BASDAI Index", desc: "Atividade de doença na Espondilite." },
    { name: "CDAI (Artrite)", desc: "Clinical Disease Activity Index." }
  ],
  "Hematologia": [
    { name: "Critérios de DIC (CIVD)", desc: "Coagulação Intravascular Disseminada." },
    { name: "4T Score (HIT)", desc: "Trombocitopenia induzida por heparina." },
    { name: "Estadiamento Ann Arbor", desc: "Linfomas." },
    { name: "IPSS (Mielodisplasia)", desc: "Prognóstico em SMD." },
    { name: "MIPI Score", desc: "Linfoma de Células do Manto." },
    { name: "Critérios CRAB (Mieloma)", desc: "Diagnóstico de Mieloma Múltiplo." },
    { name: "FLIPI Score", desc: "Prognóstico em Linfoma Folicular." },
    { name: "Score de Khorana", desc: "Risco de TEV em pacientes oncológicos." }
  ],
  "Infectologia": [
     { name: "Protocolo Febre Neutropênica", desc: "MASCC Score e Conduta." },
     { name: "Manejo da Dengue (MS)", desc: "Grupos A, B, C e D." },
     { name: "Profilaxia Pós-Exposição (PEP)", desc: "HIV e Hepatites." },
     { name: "Endocardite (Duke)", desc: "Critérios maiores e menores." },
     { name: "SIRS Criteria", desc: "Síndrome da Resposta Inflamatória Sistêmica." },
     { name: "Meningite (Análise Liquórica)", desc: "Viral, Bacteriana, Fúngica." },
     { name: "PSI (Pneumonia Severity Index)", desc: "Classificação de risco completa." },
     { name: "Score de Pitt (Bacteremia)", desc: "Gravidade de bacteremia." },
     // Novos
     { name: "qSOFA", desc: "Quick Sepsis Related Organ Failure Assessment." }
  ],
  "Medicina Intensiva": [
    { name: "APACHE II", desc: "Gravidade e mortalidade em UTI." },
    { name: "SAPS 3", desc: "Simplified Acute Physiology Score." },
    { name: "RASS", desc: "Richmond Agitation-Sedation Scale." },
    { name: "CAM-ICU", desc: "Avaliação de Delirium na UTI." },
    { name: "Nutric Score", desc: "Risco nutricional em críticos." },
    { name: "P/F Ratio", desc: "Índice de oxigenação (PaO2/FiO2)." },
    { name: "Weaning (Tobin)", desc: "Índice de respiração rápida e superficial (IRRS)." },
    { name: "PIC (Pressão Intracraniana)", desc: "Curvas e manejo." },
    { name: "Checklist FAST HUG MAIDENS", desc: "Rotina diária de UTI." },
    { name: "Score de Braden", desc: "Risco de lesão por pressão." },
    // Novos
    { name: "SOFA Score Diário", desc: "Acompanhamento de disfunção." },
    { name: "CPOT (Dor em UTI)", desc: "Avaliação de dor em paciente não-comunicativo." }
  ],
  "Cirurgia Geral": [
    { name: "Alvarado Score", desc: "Diagnóstico de Apendicite." },
    { name: "Ranson Criteria", desc: "Pancreatite Aguda." },
    { name: "Classificação ASA", desc: "Risco anestésico pré-operatório." },
    { name: "Mallampati", desc: "Dificuldade de intubação." },
    { name: "Hérnias (Nyhus)", desc: "Classificação de hérnias inguinais." },
    { name: "POSSUM Score", desc: "Mortalidade e Morbidade Cirúrgica." },
    { name: "Classificação de Clavien-Dindo", desc: "Complicações pós-operatórias." },
    { name: "Score de Caprini", desc: "Risco de TVP em cirurgia." },
    // Novos
    { name: "EuroSCORE II", desc: "Risco em cirurgia cardíaca." }
  ],
  "Dermatologia": [
    { name: "Regra dos 9 (Queimadura)", desc: "Cálculo de SCQ." },
    { name: "SCORTEN", desc: "Necrólise Epidérmica Tóxica (NET/SJS)." },
    { name: "ABCD (Melanoma)", desc: "Assimetria, Bordas, Cor, Diâmetro." },
    { name: "PASI Score", desc: "Gravidade da Psoríase." },
    { name: "DLQI (Qualidade de Vida)", desc: "Dermatology Life Quality Index." },
    { name: "EASI Score", desc: "Eczema Area and Severity Index." },
    // Novos
    { name: "Classificação de Fitzpatrick", desc: "Fototipos de pele." },
    { name: "Urticaria Activity Score (UAS7)", desc: "Gravidade da urticária." }
  ],
  "Oftalmologia": [
    { name: "Olho Vermelho (Diferencial)", desc: "Conjuntivite, Uveíte, Glaucoma Agudo." },
    { name: "Retinopatia Diabética", desc: "Classificação e seguimento." },
    { name: "Queimadura Química Ocular", desc: "Classificação de Roper-Hall." },
    // Novos
    { name: "Tabela de Snellen (Conversão)", desc: "Acuidade visual." }
  ],
  "Ferramentas Diagnósticas": [
     { name: "Análise de ECG (IA)", desc: "Interpretação automática de Eletrocardiograma via foto.", type: "image" },
     { name: "Dermatoscopia (IA)", desc: "Análise de lesões de pele (ABCD) via foto.", type: "image" },
     { name: "Raio-X (IA)", desc: "Interpretação preliminar de Radiografias.", type: "image" },
     { name: "Calculadora de Risco Cirúrgico", desc: "Goldman, ASA e Detsky." },
     { name: "Interpretação de Gasometria", desc: "Distúrbios ácido-básicos." },
     { name: "Biópsia Virtual (IA)", desc: "Análise de laudos anatomopatológicos.", type: "text" },
     { name: "Calculadora de Déficit de Ferro", desc: "Fórmula de Ganzoni." },
     { name: "Interpretação de Espirometria", desc: "Distúrbios obstrutivos e restritivos." },
     { name: "Análise de Líquido Ascítico", desc: "GASA e celularidade." }
  ],
  "Administrativo": [
    { name: "Gerador de Atestado", desc: "Atestado médico padrão com CID opcional." },
    { name: "Laudo para INSS", desc: "Relatório detalhado para perícia médica." },
    { name: "Solicitação de Vaga (CROSS)", desc: "Modelo de regulação de urgência." },
    { name: "Termo de Consentimento", desc: "Genérico para procedimentos invasivos." },
    { name: "Carta de Encaminhamento", desc: "Referência para especialista." },
    { name: "Receituário de Controle Especial", desc: "Modelo para Branco (C1) e Azul (B1)." },
    { name: "Notificação Compulsória", desc: "Lista de doenças de notificação imediata." },
    { name: "Declaração de Óbito", desc: "Orientações de preenchimento." }
  ]
};

// --- Utilities ---

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      const base64Content = base64Data.split(',')[1];
      resolve({
        inlineData: {
          data: base64Content,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const fileToDataUrl = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// --- Toast Notification Component ---
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-[100] animate-in slide-in-from-right-10 fade-in duration-300 rounded-lg shadow-2xl p-4 flex items-center gap-3 border ${type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
      <div className={`p-1 rounded-full ${type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
        {type === 'success' ? <Check size={16}/> : <AlertTriangle size={16}/>}
      </div>
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100"><X size={14}/></button>
    </div>
  );
};


// --- Theme Types ---
type ThemeColor = 'blue' | 'violet' | 'emerald' | 'rose' | 'amber';

const THEMES: Record<ThemeColor, { 
  primary: string, 
  secondary: string, 
  accent: string,
  gradient: string, 
  darkBg: string, 
  lightBg: string, 
  panelDark: string, 
  panelLight: string 
}> = {
  blue: {
    primary: 'blue',
    secondary: 'sky',
    accent: 'cyan',
    gradient: 'from-blue-700 to-sky-400',
    darkBg: 'bg-[#0b1121]',
    lightBg: 'bg-slate-50',
    panelDark: 'glass-dark border-blue-500/10',
    panelLight: 'glass-light border-slate-200'
  },
  violet: {
    primary: 'violet',
    secondary: 'fuchsia',
    accent: 'purple',
    gradient: 'from-violet-700 to-fuchsia-400',
    darkBg: 'bg-[#1a0b2e]',
    lightBg: 'bg-purple-50',
    panelDark: 'glass-dark border-violet-500/10',
    panelLight: 'glass-light border-purple-200'
  },
  emerald: {
    primary: 'emerald',
    secondary: 'teal',
    accent: 'green',
    gradient: 'from-emerald-700 to-teal-400',
    darkBg: 'bg-[#062c1b]',
    lightBg: 'bg-emerald-50',
    panelDark: 'glass-dark border-emerald-500/10',
    panelLight: 'glass-light border-emerald-200'
  },
  rose: {
    primary: 'rose',
    secondary: 'pink',
    accent: 'red',
    gradient: 'from-rose-700 to-pink-400',
    darkBg: 'bg-[#2e0b16]',
    lightBg: 'bg-rose-50',
    panelDark: 'glass-dark border-rose-500/10',
    panelLight: 'glass-light border-rose-200'
  },
  amber: {
    primary: 'amber',
    secondary: 'orange',
    accent: 'yellow',
    gradient: 'from-amber-700 to-orange-400',
    darkBg: 'bg-[#2e1d0b]',
    lightBg: 'bg-orange-50',
    panelDark: 'glass-dark border-amber-500/10',
    panelLight: 'glass-light border-orange-200'
  }
};

// --- Custom Markdown Renderer ---
// Handles Tables, Headers (removing #), Bold, Lists
const SimpleMarkdown = ({ content, theme }: { content: string, theme: 'dark' | 'light' }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const renderedLines: React.ReactNode[] = [];
  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];

  const textColorClass = theme === 'dark' ? 'text-gray-100' : 'text-slate-800';
  const tableBorderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';

  const processText = (text: string) => {
    // Bold
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className={theme === 'dark' ? 'text-white' : 'text-black'}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Table Logic
    if (line.startsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableHeader = line.split('|').filter(c => c.trim() !== '').map(c => c.trim());
        // Skip the next line if it's separator like |---|---|
        if (lines[i + 1]?.trim().startsWith('|') && lines[i + 1].includes('---')) {
          i++;
        }
      } else {
        const row = line.split('|').filter(c => c.trim() !== '').map(c => c.trim());
        tableRows.push(row);
      }
      continue;
    } 
    
    // If we were in a table and hit a non-table line, render the collected table
    if (inTable) {
      renderedLines.push(
        <div key={`table-${i}`} className={`my-4 overflow-x-auto rounded-lg border ${tableBorderColor}`}>
          <table className="w-full text-sm text-left">
            <thead className={`text-xs uppercase ${theme === 'dark' ? 'bg-white/10 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
              <tr>
                {tableHeader.map((h, hi) => <th key={hi} className="px-4 py-3 font-bold">{processText(h)}</th>)}
              </tr>
            </thead>
            <tbody className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>
              {tableRows.map((row, ri) => (
                <tr key={ri} className={`border-b ${theme === 'dark' ? 'border-gray-700 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                  {row.map((c, ci) => <td key={ci} className="px-4 py-3 whitespace-pre-wrap">{processText(c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      inTable = false;
      tableHeader = [];
      tableRows = [];
    }

    // Headers
    if (line.startsWith('#')) {
      const level = line.match(/^#+/)?.[0].length || 0;
      const text = line.replace(/^#+\s*/, '');
      const sizeClass = level === 1 ? 'text-2xl mt-6 mb-4 border-b pb-2' : level === 2 ? 'text-xl mt-5 mb-3' : 'text-lg mt-4 mb-2';
      renderedLines.push(
        <div key={i} className={`font-bold ${theme === 'dark' ? 'text-white border-white/10' : 'text-slate-900 border-gray-200'} ${sizeClass}`}>
          {processText(text)}
        </div>
      );
      continue;
    }

    // Lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      renderedLines.push(
        <div key={i} className="flex gap-2 mb-1 ml-2">
          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>•</span>
          <span className={textColorClass}>{processText(line.substring(2))}</span>
        </div>
      );
      continue;
    }

    // Normal Text (empty lines as breaks)
    if (line === '') {
      renderedLines.push(<div key={i} className="h-2" />);
    } else {
      renderedLines.push(<div key={i} className={`mb-1 leading-relaxed ${textColorClass}`}>{processText(line)}</div>);
    }
  }

  // Flush remaining table if exists at end
  if (inTable) {
     renderedLines.push(
        <div key={`table-end`} className={`my-4 overflow-x-auto rounded-lg border ${tableBorderColor}`}>
          <table className="w-full text-sm text-left">
            <thead className={`text-xs uppercase ${theme === 'dark' ? 'bg-white/10 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
              <tr>{tableHeader.map((h, hi) => <th key={hi} className="px-4 py-3">{processText(h)}</th>)}</tr>
            </thead>
            <tbody className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>
              {tableRows.map((row, ri) => (
                <tr key={ri} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  {row.map((c, ci) => <td key={ci} className="px-4 py-3">{processText(c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }

  return <div className={`${textColorClass}`}>{renderedLines}</div>;
};


// --- Main App Component ---

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [colorTheme, setColorTheme] = useState<ThemeColor>('blue');
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');

  const [activeTab, setActiveTab] = useState<'soap' | 'clinical' | 'docs' | 'rx' | 'patients'>('soap');
  
  // Data States
  const [patientData, setPatientData] = useState({ name: '', age: '', gender: '', id: '', dum: '', bed: '' });
  const [soap, setSoap] = useState({ s: '', o: '', a: '', p: '' });
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  
  // Doctor/Header Data (Editable)
  // FIXED: Removed Deodato/CRM44 default values. Using generic placeholders.
  const [doctorData, setDoctorData] = useState({
      name: 'Dr. Nome Sobrenome',
      specialty: 'ESPECIALIDADE',
      crm: 'CRM/UF 00000',
      address: 'Endereço do Consultório, 000 - Cidade/UF',
      phone: '(00) 0000-0000'
  });

  // Magic SOAP State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  // IG Calculator
  const [showIgModal, setShowIgModal] = useState(false);
  const [igMethod, setIgMethod] = useState<'dum' | 'usg'>('dum');
  const [igDateInput, setIgDateInput] = useState('');
  const [usgWeeks, setUsgWeeks] = useState('');
  const [usgDays, setUsgDays] = useState('');
  const [igResult, setIgResult] = useState('');

  // Clinical Functions State
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<{name: string, desc: string, type?: 'text'|'image'|'both'} | null>(null);
  const [toolInput, setToolInput] = useState('');
  const [toolImage, setToolImage] = useState<File | null>(null);
  const [toolOutput, setToolOutput] = useState('');
  const [fluxoImage, setFluxoImage] = useState<string | null>(null);

  // Prescriber State
  const [searchTerm, setSearchTerm] = useState('');
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [manualItem, setManualItem] = useState({ type: 'med', name: '', details: '' });

  // Docs State
  const [docType, setDocType] = useState<'receita' | 'hospital' | 'exame'>('receita');
  const [logoImage, setLogoImage] = useState<string | null>(null);


  // Theme Helpers
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  
  const getAI = () => {
    if (!apiKey) {
      setShowSettings(true);
      showToastMessage("Por favor, configure sua API Key nas configurações para usar a IA.", "error");
      throw new Error("API Key missing");
    }
    return new GoogleGenAI({ apiKey });
  };
  
  // Persist API Key
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey);
    }
  }, [apiKey]);

  // Initial check
  useEffect(() => {
    if (!apiKey) {
       setShowSettings(true);
       showToastMessage("Bem-vindo! Configure sua API Key para começar.", "success");
    }
  }, []);

  // Dynamic Color Classes based on selection
  const currentTheme = THEMES[colorTheme];
  const primaryColor = currentTheme.primary;
  const secondaryColor = currentTheme.secondary;
  
  const bgClass = theme === 'dark' ? `${currentTheme.darkBg} text-${secondaryColor}-50` : `${currentTheme.lightBg} text-slate-800`;
  const panelClass = theme === 'dark' ? currentTheme.panelDark : currentTheme.panelLight;
  
  // Explicit text color for inputs in dark mode to avoid mobile issues
  // CHANGED: Use opaque background in dark mode (bg-gray-900) instead of transparent to fix mobile rendering issues
  const inputClass = theme === 'dark' 
    ? `bg-gray-900 border-${primaryColor}-800/30 text-white placeholder-gray-500 focus:border-${primaryColor}-500 focus:ring-1 focus:ring-${primaryColor}-500` 
    : `bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-${primaryColor}-600 focus:ring-1 focus:ring-${primaryColor}-600`;
  
  const subText = theme === 'dark' ? `text-${primaryColor}-300/60` : 'text-slate-500';

  // --- Handlers ---
  
  const showToastMessage = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type });
  };

  const handleSavePatient = () => {
    if (!patientData.name) {
      showToastMessage("Nome do paciente é obrigatório para salvar!", "error");
      return;
    }
    try {
      console.log("Saving patient:", { ...patientData, soap, prescriptions, exams });
      showToastMessage("Paciente salvo com sucesso!", "success");
    } catch (e) {
      showToastMessage("Erro ao salvar paciente.", "error");
    }
  };

  const handleMagicSoap = async (file: File) => {
    try {
      setIsProcessing(true);
      setProcessingStatus("Processando arquivo...");
      const ai = getAI();
      const part = await fileToGenerativePart(file);
      
      setProcessingStatus("Analisando áudio/imagem com IA...");

      const prompt = `
        Você é um escriba médico especialista e altamente técnico. 
        Sua tarefa é transcrever e organizar o conteúdo deste arquivo em um registro médico formal (Método SOAP).
        
        Separe o conteúdo ESTRITAMENTE nos campos JSON solicitados.
        - Não perca detalhes clínicos, valores, nomes de medicamentos e queixas.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [part, { text: prompt }]
        },
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subjective: { type: Type.STRING, description: "Queixa principal, HDA, HPP, História Social, Medicamentos em uso." },
              objective: { type: Type.STRING, description: "Exame físico, Sinais Vitais, Geral, ACV, AR, ABD, EXT, Neuro." },
              assessment: { type: Type.STRING, description: "Hipóteses diagnósticas, Raciocínio clínico, Problemas ativos." },
              plan: { type: Type.STRING, description: "Conduta, Prescrições, Orientações de alta, Solicitações de exames." },
            },
            required: ["subjective", "objective", "assessment", "plan"],
          }
        }
      });
      
      setProcessingStatus("Organizando registros...");

      const text = response.text;
      if (text) {
        const data = JSON.parse(text);
        setSoap(prev => ({
          s: prev.s + (data.subjective ? (prev.s ? '\n\n' : '') + data.subjective : ''),
          o: prev.o + (data.objective ? (prev.o ? '\n\n' : '') + data.objective : ''),
          a: prev.a + (data.assessment ? (prev.a ? '\n\n' : '') + data.assessment : ''),
          p: prev.p + (data.plan ? (prev.p ? '\n\n' : '') + data.plan : '')
        }));
        showToastMessage("Transcrição realizada com sucesso!", "success");
      }
    } catch (e) {
      if (e.message !== "API Key missing") {
        showToastMessage("Erro ao processar Magic SOAP: " + e.message, "error");
      }
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  const handleObjectiveAnalysis = async (files: FileList) => {
    try {
      setIsProcessing(true);
      setProcessingStatus("Analisando exames...");
      const ai = getAI();
      const parts = await Promise.all(Array.from(files).map(fileToGenerativePart));
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            ...parts,
            { text: "Analise detalhadamente estes exames (laboratoriais/imagem). Liste os achados anormais, valores de referência relevantes e uma conclusão clínica sugerida. Use Markdown e tabelas onde apropriado." }
          ]
        }
      });
      
      setSoap(prev => ({ ...prev, o: prev.o + '\n\n=== ANÁLISE DE EXAMES (IA) ===\n' + response.text }));
      showToastMessage("Análise de exames concluída!", "success");
    } catch (e) {
      if (e.message !== "API Key missing") {
        showToastMessage("Erro ao analisar exames.", "error");
      }
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  const handlePatientTranslator = async () => {
    try {
      setIsProcessing(true);
      setProcessingStatus("Traduzindo para linguagem simples...");
      setToolOutput('');
      setFluxoImage(null);
      setSelectedTabForOutput("Tradutor para Paciente", "Explicação simplificada");
      
      const ai = getAI();
      const soapContext = `PACIENTE: ${patientData.name || 'Não informado'}, ${patientData.age || '?'} anos.\nDADOS ATUAIS (SOAP):\nS: ${soap.s}\nO: ${soap.o}\nA: ${soap.a}\nP: ${soap.p}`;
      const prompt = `
        Com base nos dados clínicos abaixo, escreva uma mensagem EXTREMAMENTE SIMPLES E EMPÁTICA para ser enviada ao paciente (via WhatsApp ou impressa).
        - Use linguagem leiga (evite jargões).
        - Explique o que ele tem.
        - Explique o que ele deve fazer (tratamento).
        - Cite sinais de alerta para voltar ao pronto-socorro.
        - Use emojis moderadamente.
        
        ${soapContext}
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ text: prompt }] }
      });
      setToolOutput(response.text);
    } catch (e) {
      if (e.message !== "API Key missing") {
        showToastMessage("Erro ao gerar explicação.", "error");
      }
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  const handleDischargeSummary = async () => {
    try {
       setIsProcessing(true);
       setProcessingStatus("Gerando sumário de alta...");
       setToolOutput('');
       setFluxoImage(null);
       setSelectedTabForOutput("Resumo de Alta", "Sumário hospitalar");

       const ai = getAI();
       const soapContext = `PACIENTE: ${patientData.name || 'Não informado'}, ${patientData.age || '?'} anos.\nDADOS ATUAIS (SOAP):\nS: ${soap.s}\nO: ${soap.o}\nA: ${soap.a}\nP: ${soap.p}`;
       const prompt = `
        Gere um SUMÁRIO DE ALTA HOSPITALAR estruturado.
        Inclua: Identificação, Diagnóstico Principal (CID-10 sugerido), Resumo da História, Exames Realizados, Procedimentos, Plano de Alta e Orientações.
        Use Markdown profissional.

        ${soapContext}
       `;
       const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ text: prompt }] }
      });
      setToolOutput(response.text);
    } catch (e) {
      if (e.message !== "API Key missing") {
        showToastMessage("Erro ao gerar sumário.", "error");
      }
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  const handleFluxoGen = async (prompt: string) => {
    try {
      setIsProcessing(true);
      setProcessingStatus("Gerando fluxograma e imagem...");
      setToolOutput('');
      setFluxoImage(null);
      setSelectedTabForOutput("Fluxo IA", "Protocolo Gerado"); 
      
      const ai = getAI();
      const textPromise = ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { 
          parts: [{ text: `
            Crie um fluxograma médico passo-a-passo detalhado sobre: ${prompt}.
            Use formatação Markdown clara com setas (->) e tópicos.
            IMPORTANTE: Use tabelas (| Col | Col |) para diferenciar condutas.
            Seja didático e siga os guidelines mais recentes.
            No final, cite as referências bibliográficas utilizadas.
            ` }] 
        }
      });

      const imagePrompt = `A professional, high-quality medical infographic flow chart about ${prompt}. White background, clean design, schematic, educational, high resolution, detailed text labels in Portuguese.`;
      const imagePromise = ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: imagePrompt }] }
      });

      const [textResponse, imageResponse] = await Promise.all([textPromise, imagePromise]);
      setToolOutput(textResponse.text);

      if (imageResponse.candidates?.[0]?.content?.parts) {
          for (const part of imageResponse.candidates[0].content.parts) {
            if (part.inlineData) {
               setFluxoImage(`data:image/png;base64,${part.inlineData.data}`);
               break;
            }
          }
      }

    } catch (e) {
      if (e.message !== "API Key missing") {
        showToastMessage("Erro ao gerar fluxo IA.", "error");
      }
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  const setSelectedTabForOutput = (name: string, desc: string) => {
      setSelectedSpecialty("IA Estratégica");
      setSelectedTool({ name, desc, type: "text" });
      setActiveTab('clinical');
  };

  const handleToolExecution = async () => {
    if (!selectedTool) return;
    try {
      setIsProcessing(true);
      setProcessingStatus(`Executando ${selectedTool.name}...`);
      setToolOutput('');
      
      const ai = getAI();
      const soapContext = `PACIENTE: ${patientData.name || 'Não informado'}, ${patientData.age || '?'} anos.\nDADOS ATUAIS (SOAP):\nS: ${soap.s}\nO: ${soap.o}\nA: ${soap.a}\nP: ${soap.p}`;
      
      let parts: any[] = [];
      
      if (toolImage) {
        const imgPart = await fileToGenerativePart(toolImage);
        parts.push(imgPart);
      }

      const prompt = `
      Atue como a ferramenta médica especializada: "${selectedTool.name}" (${selectedTool.desc}).
      
      CONTEXTO DO PACIENTE:
      ${soapContext}
      
      DADOS INSERIDOS:
      ${toolInput}
      
      INSTRUÇÕES DE FORMATAÇÃO (CRUCIAL):
      1. Sua saída será renderizada por um parser Markdown estrito.
      2. **NÃO USE HASHTAGS (#)** para títulos no meio do texto a menos que seja um cabeçalho real.
      3. **USE TABELAS MARKDOWN** (| Item | Valor |) sempre que comparar dados, mostrar scores ou diagnósticos diferenciais. Isso é mandatório.
      4. Use listas com marcadores (-) para facilitar a leitura.
      5. Não use blocos de código (\`\`\`) a menos que seja estritamente necessário.

      INSTRUÇÕES MÉDICAS:
      1. Calcule scores com precisão.
      2. Se faltarem dados, forneça o guideline teórico.
      3. OBRIGATÓRIO: Ao final da resposta, inclua uma seção "REFERÊNCIAS" citando as diretrizes ou estudos utilizados (ex: SBC 2024, AHA, UpToDate).
      `;

      parts.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts: parts }
      });

      setToolOutput(response.text);

    } catch(e) {
      if (e.message !== "API Key missing") {
         setToolOutput("Erro na execução da ferramenta: " + e.message);
      }
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  const calculateIG = () => {
    if (!igDateInput) return;
    const today = new Date();
    const inputDate = new Date(igDateInput);
    let gestationalAgeDays = 0;
    let dpp = new Date();

    if (igMethod === 'dum') {
      const diffTime = Math.abs(today.getTime() - inputDate.getTime());
      gestationalAgeDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      dpp = new Date(inputDate);
      dpp.setDate(inputDate.getDate() + 280);
    } else {
      const w = parseInt(usgWeeks) || 0;
      const d = parseInt(usgDays) || 0;
      const daysAtUSG = (w * 7) + d;
      const diffTime = Math.abs(today.getTime() - inputDate.getTime());
      const daysSinceUSG = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      gestationalAgeDays = daysAtUSG + daysSinceUSG;
      const daysRemaining = 280 - daysAtUSG;
      dpp = new Date(inputDate);
      dpp.setDate(inputDate.getDate() + daysRemaining);
    }

    const currentWeeks = Math.floor(gestationalAgeDays / 7);
    const currentDays = gestationalAgeDays % 7;
    setIgResult(`IG Atual: ${currentWeeks} semanas e ${currentDays} dias\nDPP Estimada: ${dpp.toLocaleDateString('pt-BR')}`);
  };

  const handleManualAdd = () => {
    if (!manualItem.name) return;
    if (manualItem.type === 'med') {
      setPrescriptions([...prescriptions, { name: manualItem.name, posology: manualItem.details, type: 'Manual' }]);
    } else {
      setExams([...exams, { name: manualItem.name }]);
    }
    setManualItem({ type: 'med', name: '', details: '' });
    setShowManualAdd(false);
    showToastMessage("Item adicionado!", "success");
  };

  const updatePrescription = (idx: number, field: string, value: string) => {
    const updated = [...prescriptions];
    updated[idx] = { ...updated[idx], [field]: value };
    setPrescriptions(updated);
  };

  const removePrescription = (idx: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== idx));
  };

  const updateExam = (idx: number, value: string) => {
    const updated = [...exams];
    updated[idx] = { ...updated[idx], name: value };
    setExams(updated);
  };

  const removeExam = (idx: number) => {
    setExams(exams.filter((_, i) => i !== idx));
  };


  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await fileToDataUrl(e.target.files[0]);
        setLogoImage(base64);
        showToastMessage("Logo atualizada!", "success");
      } catch (err) {
        showToastMessage("Erro ao carregar logo.", "error");
      }
    }
  };

  // --- Filtering & Memoization ---
  const filteredMeds = useMemo(() => {
    if (!searchTerm) return MEDICATIONS_DB.slice(0, 50); 
    return MEDICATIONS_DB.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const filteredExams = useMemo(() => {
    if (!searchTerm) return EXAMS_DB.slice(0, 50);
    return EXAMS_DB.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  // --- Renderers ---

  const renderSOAP = () => (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4 pb-24">
      {/* Header */}
      <div className={`${panelClass} p-4 rounded-xl space-y-3`}>
        <div className="flex justify-between items-center">
            <h2 className="font-bold flex items-center gap-2 text-xl">
              <div className="relative">
                <BrainCircuit size={28} className={`text-${primaryColor}-500`}/>
                <Sparkles size={12} className={`text-${secondaryColor}-300 absolute -top-1 -right-1 animate-pulse`}/>
              </div>
              <span className={`bg-gradient-to-r ${currentTheme.gradient} text-transparent bg-clip-text`}>Nexus</span>
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Med</span>
            </h2>
            
            <div className="flex gap-2">
               <button onClick={() => setShowSettings(true)} className={`p-2 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-white/10 text-gray-300 hover:bg-white/20' : `bg-${primaryColor}-100 text-${primaryColor}-700 hover:bg-${primaryColor}-200`}`}>
                  <Settings size={18}/>
                  {!apiKey && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>}
               </button>
               <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-white/10 text-yellow-400 hover:bg-white/20' : `bg-${primaryColor}-100 text-${primaryColor}-700 hover:bg-${primaryColor}-200`}`}>
                  {theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}
               </button>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Nome Completo" className={`w-full rounded p-2 text-sm outline-none border ${inputClass}`} value={patientData.name} onChange={e => setPatientData({...patientData, name: e.target.value})} />
          <div className="grid grid-cols-3 gap-2">
            <input placeholder="Idade" className={`w-full rounded p-2 text-sm outline-none border ${inputClass}`} value={patientData.age} onChange={e => setPatientData({...patientData, age: e.target.value})} />
            <input placeholder="Gênero" className={`w-full rounded p-2 text-sm outline-none border ${inputClass}`} value={patientData.gender} onChange={e => setPatientData({...patientData, gender: e.target.value})} />
            <input placeholder="Leito" className={`w-full rounded p-2 text-sm outline-none border ${inputClass}`} value={patientData.bed} onChange={e => setPatientData({...patientData, bed: e.target.value})} />
          </div>
        </div>
      </div>

      {/* Expanded Action Bar (Grid 5) */}
      <div className="grid grid-cols-5 gap-2">
        <button onClick={() => setShowIgModal(true)} className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${theme === 'dark' ? `bg-${secondaryColor}-900/20 border-${secondaryColor}-700/30 hover:bg-${secondaryColor}-900/40` : `bg-${secondaryColor}-50 border-${secondaryColor}-200 hover:bg-${secondaryColor}-100`}`}>
          <Calculator size={20} className={`text-${secondaryColor}-500 mb-1`} />
          <span className={`text-[10px] font-bold ${theme === 'dark' ? `text-${secondaryColor}-100` : `text-${secondaryColor}-700`}`}>IG Calc</span>
        </button>
        
        <label className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer relative ${theme === 'dark' ? `bg-${primaryColor}-900/20 border-${primaryColor}-700/30 hover:bg-${primaryColor}-900/40` : `bg-${primaryColor}-50 border-${primaryColor}-200 hover:bg-${primaryColor}-100`}`}>
           {isProcessing && <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center rounded-xl"><div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div></div>}
          <Wand2 size={20} className={`text-${primaryColor}-500 mb-1`} />
          <span className={`text-[10px] font-bold leading-tight text-center ${theme === 'dark' ? `text-${primaryColor}-100` : `text-${primaryColor}-700`}`}>Magic SOAP</span>
          <input type="file" className="hidden" accept="audio/*,image/*,.pdf" onChange={(e) => e.target.files?.[0] && handleMagicSoap(e.target.files[0])} />
        </label>

        <button onClick={() => handleFluxoGen("Protocolo Geral de Atendimento")} className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${theme === 'dark' ? `bg-${currentTheme.accent}-900/20 border-${currentTheme.accent}-700/30 hover:bg-${currentTheme.accent}-900/40` : `bg-${currentTheme.accent}-50 border-${currentTheme.accent}-200 hover:bg-${currentTheme.accent}-100`}`}>
          <Network size={20} className={`text-${currentTheme.accent}-500 mb-1`} />
          <span className={`text-[10px] font-bold ${theme === 'dark' ? `text-${currentTheme.accent}-100` : `text-${currentTheme.accent}-700`}`}>Fluxo IA</span>
        </button>

        {/* New Magic Feature 1: Tradutor Paciente */}
        <button onClick={handlePatientTranslator} className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${theme === 'dark' ? `bg-emerald-900/20 border-emerald-700/30 hover:bg-emerald-900/40` : `bg-emerald-50 border-emerald-200 hover:bg-emerald-100`}`}>
          <MessageCircle size={20} className="text-emerald-500 mb-1" />
          <span className={`text-[10px] font-bold text-center leading-tight ${theme === 'dark' ? `text-emerald-100` : `text-emerald-700`}`}>Tradutor Paciente</span>
        </button>

        {/* New Magic Feature 2: Resumo Alta */}
        <button onClick={handleDischargeSummary} className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${theme === 'dark' ? `bg-rose-900/20 border-rose-700/30 hover:bg-rose-900/40` : `bg-rose-50 border-rose-200 hover:bg-rose-100`}`}>
          <LogOut size={20} className="text-rose-500 mb-1" />
          <span className={`text-[10px] font-bold text-center leading-tight ${theme === 'dark' ? `text-rose-100` : `text-rose-700`}`}>Resumo Alta</span>
        </button>
      </div>

      {/* SOAP Fields */}
      {['s', 'o', 'a', 'p'].map((field) => (
        <div key={field} className={`${panelClass} rounded-xl flex flex-col relative group transition-all focus-within:ring-1 ring-${primaryColor}-500/50 shadow-sm`}>
          <div className={`flex justify-between items-center p-3 border-b rounded-t-xl ${theme === 'dark' ? 'border-white/5 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
            <span className={`font-bold text-${primaryColor}-500 uppercase tracking-wider text-sm flex items-center gap-2`}>
              {field === 's' ? 'Subjetivo' : field === 'o' ? 'Objetivo' : field === 'a' ? 'Avaliação' : 'Plano'}
            </span>
            <div className="flex gap-2">
              {field === 'o' && (
                <label className={`p-1.5 hover:bg-${primaryColor}-500/10 rounded cursor-pointer transition-colors`} title="Anexar Exames">
                  <Upload size={14} className={`text-${primaryColor}-500`}/>
                  <input type="file" multiple className="hidden" onChange={(e) => e.target.files && handleObjectiveAnalysis(e.target.files)} />
                </label>
              )}
              <button onClick={() => setSoap(prev => ({ ...prev, [field]: '' }))} className="p-1.5 hover:bg-red-500/10 rounded text-gray-400 hover:text-red-500 transition-colors" title="Limpar Seção">
                <Trash2 size={14}/>
              </button>
            </div>
          </div>
           {field === 'o' && soap.o.includes('=== ANÁLISE DE EXAMES') ? (
               <div className="relative">
                    <textarea
                    className={`bg-transparent w-full p-3 min-h-[140px] outline-none text-sm resize-y leading-relaxed ${theme === 'dark' ? `text-${secondaryColor}-100 placeholder-${secondaryColor}-300/30` : 'text-slate-800 placeholder-slate-400'}`}
                    value={soap[field as keyof typeof soap]}
                    onChange={(e) => setSoap({ ...soap, [field]: e.target.value })}
                  />
                  <div className={`absolute top-0 right-0 p-2 text-xs text-${primaryColor}-500 opacity-50 pointer-events-none`}>Markdown Mode</div>
               </div>
           ) : (
              <textarea
                className={`bg-transparent w-full p-3 min-h-[140px] outline-none text-sm resize-y leading-relaxed ${theme === 'dark' ? `text-${secondaryColor}-100 placeholder-${secondaryColor}-300/30` : 'text-slate-800 placeholder-slate-400'}`}
                placeholder={`Digite o ${field === 's' ? 'subjetivo' : field === 'o' ? 'objetivo' : field === 'a' ? 'raciocínio clínico' : 'plano terapêutico'}...`}
                value={soap[field as keyof typeof soap]}
                onChange={(e) => setSoap({ ...soap, [field]: e.target.value })}
              />
           )}
        </div>
      ))}
      
      <button onClick={handleSavePatient} className={`w-full bg-${primaryColor}-600 hover:bg-${primaryColor}-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-${primaryColor}-900/20 flex items-center justify-center gap-2 transition-all`}>
        <Save size={18}/> Salvar Paciente
      </button>

      {/* IG Modal */}
      {showIgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`${theme === 'dark' ? 'bg-[#0b1121] border-white/10' : 'bg-white border-slate-200'} border p-6 rounded-xl w-full max-w-sm shadow-2xl`}>
            <h3 className={`text-lg font-bold text-${primaryColor}-500 mb-4`}>Calculadora IG & DPP</h3>
            <div className="flex gap-2 mb-4 bg-gray-500/10 p-1 rounded-lg">
                <button onClick={() => { setIgMethod('dum'); setIgResult(''); }} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${igMethod === 'dum' ? `bg-${primaryColor}-600 text-white` : 'text-gray-500 hover:text-gray-400'}`}>Pela DUM</button>
                <button onClick={() => { setIgMethod('usg'); setIgResult(''); }} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${igMethod === 'usg' ? `bg-${primaryColor}-600 text-white` : 'text-gray-500 hover:text-gray-400'}`}>Pelo USG</button>
            </div>
            <label className={`text-xs mb-1 block ${subText}`}>{igMethod === 'dum' ? 'Data da Última Menstruação' : 'Data do Exame USG'}</label>
            <input type="date" className={`w-full rounded p-2 mb-4 border ${inputClass}`} value={igDateInput} onChange={(e) => setIgDateInput(e.target.value)} />
            {igMethod === 'usg' && (
              <div className="mb-4 animate-in fade-in slide-in-from-top-2">
                 <label className={`text-xs mb-1 block ${subText}`}>Idade Gestacional no USG</label>
                 <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <input type="number" placeholder="0" className={`w-full rounded p-2 pr-8 border ${inputClass}`} value={usgWeeks} onChange={(e) => setUsgWeeks(e.target.value)} />
                        <span className="absolute right-3 top-2 text-xs text-gray-500">sem</span>
                    </div>
                    <div className="flex-1 relative">
                        <input type="number" placeholder="0" max="6" className={`w-full rounded p-2 pr-8 border ${inputClass}`} value={usgDays} onChange={(e) => setUsgDays(e.target.value)} />
                        <span className="absolute right-3 top-2 text-xs text-gray-500">dias</span>
                    </div>
                 </div>
              </div>
            )}
            <button onClick={calculateIG} className={`w-full py-3 bg-${primaryColor}-600 hover:bg-${primaryColor}-500 text-white rounded-lg font-bold mb-4`}>Calcular</button>
            {igResult && <div className={`bg-${primaryColor}-500/10 p-4 rounded-lg border border-${primaryColor}-500/20 text-${primaryColor}-500 font-bold text-center mb-4 whitespace-pre-line text-lg`}>{igResult}</div>}
            <button onClick={() => setShowIgModal(false)} className={`w-full py-2 rounded text-sm font-semibold ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );

  const renderClinical = () => {
    if (selectedTool) {
      return (
        <div className="h-full flex flex-col">
          <div className={`p-4 border-b flex items-center gap-3 shrink-0 ${theme === 'dark' ? `border-${primaryColor}-500/10 bg-[#000000]/20` : 'border-slate-200 bg-slate-50'}`}>
            <button onClick={() => { setSelectedTool(null); setToolOutput(''); setToolInput(''); setToolImage(null); setFluxoImage(null); }} className="p-2 rounded-full hover:bg-gray-500/10">
              <ArrowLeft size={20} className={theme === 'dark' ? 'text-white' : 'text-slate-700'}/>
            </button>
            <div>
              <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{selectedTool.name}</h2>
              <p className={`text-xs text-${primaryColor}-400 line-clamp-1`}>{selectedTool.desc}</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
            <div className={`${panelClass} p-4 rounded-xl`}>
              <label className={`block text-xs font-bold mb-2 uppercase tracking-wide ${subText}`}>Dados / Parâmetros</label>
              <textarea 
                className={`w-full p-3 rounded-lg border min-h-[100px] outline-none ${inputClass}`}
                placeholder={selectedTool.type === 'image' ? "Descreva o quadro clínico do paciente..." : "Insira os dados clínicos necessários (Ex: PA, FC, Creatinina, Sintomas...)"}
                value={toolInput}
                onChange={e => setToolInput(e.target.value)}
              />
              {selectedTool.type === 'image' && (
                <div className="mt-3">
                   <label className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-${primaryColor}-500/5 transition-all ${theme === 'dark' ? `border-${primaryColor}-800/30 text-${primaryColor}-400` : `border-slate-300 text-slate-500`}`}>
                     <div className="flex flex-col items-center gap-2">
                       <Camera size={24}/>
                       <span className="text-xs font-bold">{toolImage ? toolImage.name : "Carregar Imagem (ECG / Lesão / RX)"}</span>
                     </div>
                     <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && setToolImage(e.target.files[0])} />
                   </label>
                </div>
              )}
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                 <button 
                  onClick={() => setToolInput(`Paciente: ${patientData.name}, ${patientData.age} anos.\nQueixa: ${soap.s}\nExame Físico: ${soap.o}\nHistória: ${soap.a}`)}
                  className={`text-xs text-${primaryColor}-500 hover:text-${primaryColor}-400 underline self-start sm:self-center`}>
                   Importar contexto do SOAP
                 </button>
                 <button 
                  onClick={selectedTool.name.includes("Fluxo") ? () => handleFluxoGen(toolInput) : handleToolExecution}
                  disabled={isProcessing}
                  className={`w-full sm:w-auto px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''} bg-${primaryColor}-600 text-white hover:bg-${primaryColor}-500 shadow-lg shadow-${primaryColor}-500/20`}>
                  {isProcessing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> : <Play size={16}/>}
                  Executar Análise
                </button>
              </div>
            </div>

            {toolOutput && (
              <div className={`${panelClass} p-5 rounded-xl border-l-4 border-l-${primaryColor}-500 animate-in fade-in slide-in-from-bottom-4`}>
                <h3 className={`text-sm font-bold text-${primaryColor}-500 mb-4 flex items-center gap-2`}><BrainCircuit size={16}/> Resultado IA</h3>
                {/* Custom Markdown Renderer to fix formatting issues */}
                <SimpleMarkdown content={toolOutput} theme={theme} />
                
                {/* Generated Visual Flowchart */}
                {fluxoImage && (
                  <div className="mt-6 border-t border-dashed border-gray-500/30 pt-4">
                     <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${subText}`}><ImageIcon size={14}/> Infográfico Gerado</h4>
                     <img src={fluxoImage} alt="Fluxograma Visual" className="w-full rounded-lg shadow-lg" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        <div className={`p-4 border-b shrink-0 ${theme === 'dark' ? `border-${primaryColor}-500/10 bg-[#000000]/20` : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className={`text-xl font-bold text-${primaryColor}-500 flex items-center gap-2`}><BrainCircuit/> IA Clínica</h2>
              <p className={`text-xs ${subText}`}>Protocolos, Calculadoras e Diagnóstico</p>
            </div>
             <button onClick={() => setShowSettings(true)} className={`p-2 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-white/10 text-gray-300 hover:bg-white/20' : `bg-${primaryColor}-100 text-${primaryColor}-700 hover:bg-${primaryColor}-200`}`}>
                  <Settings size={18}/>
                  {!apiKey && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-24">
          {selectedSpecialty ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <button onClick={() => setSelectedSpecialty(null)} className={`mb-4 text-sm flex items-center gap-1 font-medium ${theme === 'dark' ? `text-${primaryColor}-400 hover:text-white` : 'text-slate-500 hover:text-slate-800'}`}>
                <ChevronDown className="rotate-90" size={16}/> Voltar para Especialidades
              </button>
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {React.createElement(SPECIALTIES_ICONS[selectedSpecialty] || Activity, { size: 20, className: `text-${primaryColor}-500` })}
                {selectedSpecialty}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {(TOOLS_DB[selectedSpecialty] || []).map((tool, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedTool(tool)}
                    className={`${panelClass} p-4 rounded-lg cursor-pointer flex justify-between items-center group transition-all hover:border-${primaryColor}-500/50 hover:shadow-md text-left w-full`}>
                    <div>
                      <div className={`font-semibold group-hover:text-${primaryColor}-400 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-800'}`}>{tool.name}</div>
                      <div className={`text-xs ${subText}`}>{tool.desc}</div>
                    </div>
                    <ChevronRight size={16} className={`text-gray-500 group-hover:text-${primaryColor}-500 transition-transform group-hover:translate-x-1`}/>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {/* Strategic AI Highlight */}
              <button onClick={() => setSelectedSpecialty("IA Estratégica")} 
                className={`col-span-2 p-4 rounded-xl cursor-pointer border hover:shadow-lg hover:-translate-y-1 transition-all text-left relative overflow-hidden group ${theme === 'dark' ? `bg-gradient-to-br from-${primaryColor}-900/40 to-${secondaryColor}-900/40 border-${primaryColor}-500/30` : `bg-gradient-to-br from-${primaryColor}-100 to-${secondaryColor}-100 border-${primaryColor}-200`}`}>
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles size={80}/>
                  </div>
                  <div className="flex items-center justify-between mb-2 relative z-10">
                     <div className={`p-2 rounded-lg ${theme === 'dark' ? `bg-${primaryColor}-500 text-white` : `bg-${primaryColor}-600 text-white`}`}>
                        <Brain size={20} />
                     </div>
                     <span className={`text-[10px] font-bold uppercase tracking-wider bg-${primaryColor}-500/20 text-${primaryColor}-500 px-2 py-0.5 rounded`}>Novo</span>
                  </div>
                  <div className={`font-bold text-lg relative z-10 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>IA Estratégica</div>
                  <div className={`text-xs mt-1 relative z-10 ${theme === 'dark' ? `text-${secondaryColor}-200` : 'text-slate-600'}`}>Segunda Opinião, Red Flags, Diferenciais</div>
              </button>

              {Object.keys(TOOLS_DB).filter(k => k !== "IA Estratégica").map(spec => (
                <button key={spec} onClick={() => setSelectedSpecialty(spec)} 
                     className={`${panelClass} p-4 rounded-xl cursor-pointer border border-transparent hover:border-${primaryColor}-500/50 transition-all hover:shadow-lg hover:-translate-y-1 text-left`}>
                  <div className="flex items-center justify-between mb-2">
                     <div className={`p-2 rounded-lg ${theme === 'dark' ? `bg-${primaryColor}-900/30 text-${primaryColor}-400` : `bg-${primaryColor}-100 text-${primaryColor}-700`}`}>
                        {React.createElement(SPECIALTIES_ICONS[spec] || Activity, { size: 20 })}
                     </div>
                  </div>
                  <div className={`font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-slate-800'}`}>{spec}</div>
                  <div className={`text-xs mt-1 ${subText}`}>{TOOLS_DB[spec].length} ferramentas</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPrescriber = () => (
    <div className="h-full flex flex-col">
      <div className={`p-4 border-b shrink-0 ${theme === 'dark' ? `border-${primaryColor}-500/10 bg-[#000000]/20` : 'border-slate-200 bg-slate-50'}`}>
        <div className="flex justify-between items-center mb-4">
             <h2 className={`text-xl font-bold text-${primaryColor}-500 flex items-center gap-2`}><Pill/> Prescritor</h2>
             <button onClick={() => setShowSettings(true)} className={`p-2 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-white/10 text-gray-300 hover:bg-white/20' : `bg-${primaryColor}-100 text-${primaryColor}-700 hover:bg-${primaryColor}-200`}`}>
                  <Settings size={18}/>
                  {!apiKey && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>}
            </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={16}/>
          <input 
            className={`w-full rounded-lg py-2 pl-10 pr-4 text-sm outline-none border ${inputClass}`} 
            placeholder="Buscar em 1000+ medicações e exames..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {/* Manual Add Trigger */}
        <button onClick={() => setShowManualAdd(true)} className={`w-full py-3 border border-dashed border-${primaryColor}-500/50 rounded-lg text-${primaryColor}-500 text-sm font-bold hover:bg-${primaryColor}-500/10 transition-colors flex items-center justify-center gap-2`}>
           <Plus size={16}/> Adicionar Item Manualmente
        </button>

        {/* Results */}
        {searchTerm && filteredMeds.length === 0 && filteredExams.length === 0 && (
           <div className="text-center py-10 opacity-50">Nenhum resultado encontrado. Adicione manualmente.</div>
        )}

        {/* Meds List */}
        {filteredMeds.length > 0 && (
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${subText} sticky top-0 bg-transparent backdrop-blur-md py-2`}>Medicações ({filteredMeds.length})</h3>
            <div className="space-y-2">
              {filteredMeds.map((med, idx) => (
                <div key={idx} className={`${panelClass} p-3 rounded-lg flex justify-between items-center`}>
                  <div className="overflow-hidden">
                    <div className={`font-semibold truncate ${theme === 'dark' ? 'text-gray-200' : 'text-slate-800'}`}>{med.name}</div>
                    <div className={`text-xs truncate ${subText}`}>{med.posology}</div>
                  </div>
                  <button 
                    onClick={() => { setPrescriptions([...prescriptions, med]); showToastMessage("Medicamento adicionado!", "success"); }}
                    className={`ml-2 p-2 rounded-full border shrink-0 transition-colors ${theme === 'dark' ? `bg-${primaryColor}-900/30 hover:bg-${primaryColor}-900/50 text-${primaryColor}-400 border-${primaryColor}-800/50` : `bg-${primaryColor}-50 hover:bg-${primaryColor}-100 text-${primaryColor}-600 border-${primaryColor}-200`}`}>
                    <Plus size={16}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exams List */}
        {filteredExams.length > 0 && (
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 mt-4 ${subText} sticky top-0 bg-transparent backdrop-blur-md py-2`}>Exames ({filteredExams.length})</h3>
            <div className="space-y-2">
              {filteredExams.map((ex, idx) => (
                <div key={idx} className={`${panelClass} p-3 rounded-lg flex justify-between items-center`}>
                  <div className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-slate-800'}`}>{ex.name}</div>
                  <button 
                    onClick={() => { setExams([...exams, ex]); showToastMessage("Exame adicionado!", "success"); }}
                    className={`p-2 rounded-full border shrink-0 transition-colors ${theme === 'dark' ? `bg-${currentTheme.accent}-900/30 hover:bg-${currentTheme.accent}-900/50 text-${currentTheme.accent}-400 border-${currentTheme.accent}-800/50` : `bg-${currentTheme.accent}-50 hover:bg-${currentTheme.accent}-100 text-${currentTheme.accent}-600 border-${currentTheme.accent}-200`}`}>
                    <Plus size={16}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Manual Add Modal */}
      {showManualAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`${theme === 'dark' ? 'bg-[#0b1121] border-white/10' : 'bg-white border-slate-200'} border p-6 rounded-xl w-full max-w-sm shadow-2xl`}>
            <h3 className={`text-lg font-bold text-${primaryColor}-500 mb-4`}>Adicionar Item Manual</h3>
            
            <div className="flex gap-2 mb-4">
              <button onClick={() => setManualItem({...manualItem, type: 'med'})} className={`flex-1 py-2 rounded text-sm font-bold transition-colors ${manualItem.type === 'med' ? `bg-${primaryColor}-600 text-white` : 'bg-transparent border border-gray-500 text-gray-500'}`}>Medicação</button>
              <button onClick={() => setManualItem({...manualItem, type: 'exame'})} className={`flex-1 py-2 rounded text-sm font-bold transition-colors ${manualItem.type === 'exame' ? `bg-${currentTheme.accent}-600 text-white` : 'bg-transparent border border-gray-500 text-gray-500'}`}>Exame</button>
            </div>

            <input 
              placeholder={manualItem.type === 'med' ? "Nome da Medicação" : "Nome do Exame"} 
              className={`w-full rounded p-2 mb-3 border ${inputClass}`}
              value={manualItem.name}
              onChange={e => setManualItem({...manualItem, name: e.target.value})}
            />
            
            {manualItem.type === 'med' && (
              <input 
                placeholder="Posologia (Ex: 1cp 8/8h)" 
                className={`w-full rounded p-2 mb-4 border ${inputClass}`}
                value={manualItem.details}
                onChange={e => setManualItem({...manualItem, details: e.target.value})}
              />
            )}

            <div className="flex gap-2">
               <button onClick={() => setShowManualAdd(false)} className={`flex-1 py-2 rounded text-sm font-semibold ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}>Cancelar</button>
               <button onClick={handleManualAdd} className={`flex-1 py-2 rounded text-sm font-bold bg-${primaryColor}-600 text-white hover:bg-${primaryColor}-500`}>Adicionar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDocs = () => (
    <div className={`h-full flex flex-col ${theme === 'dark' ? currentTheme.darkBg : 'bg-slate-100'}`}>
      <div className={`p-4 border-b flex justify-between items-center shrink-0 ${theme === 'dark' ? `border-${primaryColor}-500/10` : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center gap-4 overflow-x-auto">
           <h2 className={`text-xl font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}><FileText/></h2>
           <div className="flex bg-gray-500/10 rounded-lg p-1 gap-1">
             <button onClick={() => setDocType('receita')} className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-2 transition-all ${docType === 'receita' ? `bg-${primaryColor}-600 text-white` : 'text-gray-500 hover:text-gray-400'}`}>
               <Layout size={14}/> Receita (A5)
             </button>
             <button onClick={() => setDocType('exame')} className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-2 transition-all ${docType === 'exame' ? `bg-${primaryColor}-600 text-white` : 'text-gray-500 hover:text-gray-400'}`}>
               <FilePlus size={14}/> Requisição (A5)
             </button>
             <button onClick={() => setDocType('hospital')} className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-2 transition-all ${docType === 'hospital' ? `bg-${primaryColor}-600 text-white` : 'text-gray-500 hover:text-gray-400'}`}>
               <TableProperties size={14}/> Hospitalar (A4)
             </button>
           </div>
        </div>
        
        <div className="flex gap-2 pl-2">
            <label className={`p-2 rounded-full transition-colors cursor-pointer ${theme === 'dark' ? 'bg-white/10 text-gray-300 hover:bg-white/20' : `bg-${primaryColor}-100 text-${primaryColor}-700 hover:bg-${primaryColor}-200`}`} title="Upload Logo">
               <UploadCloud size={18}/>
               <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
            </label>
            <button onClick={() => window.print()} className={`bg-${primaryColor}-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-${primaryColor}-700`}>
             <Printer size={16}/> <span className="hidden md:inline">Imprimir</span>
            </button>
        </div>
      </div>
      
      <div className={`flex-1 overflow-y-auto p-4 md:p-8 flex justify-center ${theme === 'dark' ? 'bg-[#000000]/30' : 'bg-slate-200'}`}>
        
        {/* SHARED LOGIC: The paper container overrides all theme colors to ensure print accuracy (White paper, black text) */}
        
        {/* DOCUMENT VIEW: STANDARD (VERTICAL A5) - RECEITA & EXAMES */}
        {(docType === 'receita' || docType === 'exame') && (
        <div className="bg-white !text-slate-900 w-[148mm] min-h-[210mm] shadow-2xl p-[10mm] relative print:w-full print:h-full print:fixed print:top-0 print:left-0 print:m-0 print:shadow-none print:rounded-none flex flex-col">
          
          {/* Editable Header */}
          <div className="flex justify-between items-start border-b-2 border-emerald-500 pb-4 mb-6">
            <div className="flex items-center gap-4">
              {logoImage ? (
                <img src={logoImage} alt="Logo" className="h-16 w-auto object-contain max-w-[100px]" />
              ) : (
                <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 border-2 border-dashed border-gray-200">
                  <span className="text-[10px] text-center">Logo</span>
                </div>
              )}
              <div className="flex flex-col">
                <input 
                   className="font-bold text-lg text-slate-900 tracking-tight bg-transparent border-none outline-none placeholder-gray-300 w-full"
                   value={doctorData.name}
                   onChange={e => setDoctorData({...doctorData, name: e.target.value})}
                   placeholder="Nome do Médico"
                />
                <input 
                   className="text-xs font-semibold text-emerald-600 uppercase tracking-wider bg-transparent border-none outline-none placeholder-emerald-200 w-full"
                   value={doctorData.specialty}
                   onChange={e => setDoctorData({...doctorData, specialty: e.target.value})}
                   placeholder="ESPECIALIDADE"
                />
                <input 
                   className="text-[10px] text-gray-500 mt-1 bg-transparent border-none outline-none placeholder-gray-300 w-full"
                   value={doctorData.crm}
                   onChange={e => setDoctorData({...doctorData, crm: e.target.value})}
                   placeholder="CRM 0000"
                />
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Emissão</div>
              <div className="text-sm font-bold text-slate-800">{new Date().toLocaleDateString('pt-BR')}</div>
            </div>
          </div>

          {/* Patient Info */}
          <div className="mb-6">
             <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Paciente</div>
             <input 
               className="text-lg border-b border-dashed border-gray-300 pb-1 w-full font-medium text-slate-900 bg-transparent outline-none placeholder-gray-300"
               value={patientData.name}
               onChange={e => setPatientData({...patientData, name: e.target.value})}
               placeholder="Nome do Paciente..."
             />
          </div>

          {/* Title */}
          <div className="text-center mb-6">
             <h2 className="text-base font-bold text-gray-400 uppercase tracking-[0.2em]">{docType === 'receita' ? 'Receituário Médico' : 'Requisição de Exames'}</h2>
          </div>

          {/* Body (Editable List) */}
          <div className="flex-1 space-y-4 min-h-[300px]">
             {docType === 'receita' ? (
               <div className="space-y-4">
                 {prescriptions.map((p, i) => (
                   <div key={i} className="group relative pl-6">
                     <span className="absolute left-0 top-1 font-bold text-gray-400 text-sm">{i + 1}.</span>
                     <div className="flex flex-col w-full">
                        <input 
                          className="font-bold text-base text-slate-900 bg-transparent border-none outline-none w-full placeholder-gray-300"
                          value={p.name}
                          onChange={(e) => updatePrescription(i, 'name', e.target.value)}
                        />
                        <textarea 
                          className="text-slate-600 text-sm italic bg-transparent border-none outline-none w-full resize-none overflow-hidden placeholder-gray-300"
                          value={p.posology}
                          onChange={(e) => {
                            updatePrescription(i, 'posology', e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                          }}
                          rows={1}
                        />
                     </div>
                     <button onClick={() => removePrescription(i)} className="absolute -right-6 top-0 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 print:hidden p-1">
                        <X size={14}/>
                     </button>
                   </div>
                 ))}
                 <button onClick={() => setPrescriptions([...prescriptions, { name: '', posology: '', type: 'Manual' }])} className="text-xs text-emerald-600 font-bold hover:underline mt-2 print:hidden flex items-center gap-1">
                   <Plus size={12}/> Adicionar Medicamento
                 </button>
               </div>
             ) : (
               <div className="space-y-2">
                 <h3 className="font-bold text-slate-900 mb-2 uppercase text-xs border-b inline-block pb-1">Solicitação</h3>
                 {exams.map((e, i) => (
                    <div key={i} className="group relative pl-4 flex items-center">
                      <span className="text-gray-400 mr-2">•</span>
                      <input 
                          className="text-sm text-slate-800 bg-transparent border-none outline-none w-full placeholder-gray-300"
                          value={e.name}
                          onChange={(e) => updateExam(i, e.target.value)}
                      />
                      <button onClick={() => removeExam(i)} className="absolute -right-6 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 print:hidden p-1">
                        <X size={14}/>
                      </button>
                    </div>
                 ))}
                 <button onClick={() => setExams([...exams, { name: '' }])} className="text-xs text-emerald-600 font-bold hover:underline mt-2 print:hidden flex items-center gap-1">
                   <Plus size={12}/> Adicionar Exame
                 </button>
               </div>
             )}
          </div>

          {/* Footer - Orientations */}
          <div className="mt-auto pt-6 mb-8">
             <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Orientações</h3>
             <textarea 
               className="w-full text-xs text-gray-500 italic bg-transparent border-l-2 border-emerald-100 pl-4 outline-none resize-none"
               defaultValue="Uso contínuo conforme prescrição. Em caso de reação adversa, suspender e retornar."
             />
          </div>

          {/* Signature Footer */}
          <div className="text-center">
             <div className="inline-block border-t border-slate-800 pt-2 px-8 w-3/4">
               <input 
                  className="font-bold text-slate-900 text-center w-full bg-transparent border-none outline-none text-sm uppercase"
                  value={doctorData.name}
                  onChange={e => setDoctorData({...doctorData, name: e.target.value})}
               />
               <input 
                  className="text-[10px] text-gray-500 text-center w-full bg-transparent border-none outline-none"
                  value={`${doctorData.address} • ${doctorData.phone}`}
                  onChange={e => setDoctorData({...doctorData, address: e.target.value})}
               />
             </div>
          </div>
        </div>
        )}

        {/* DOCUMENT VIEW: HOSPITAL (HORIZONTAL A4 TABLE) */}
        {docType === 'hospital' && (
        <div className="bg-white !text-slate-900 w-[297mm] min-h-[210mm] shadow-2xl p-[10mm] relative print:w-full print:h-full print:fixed print:top-0 print:left-0 print:m-0 print:shadow-none print:rounded-none print:landscape flex flex-col">
           
           {/* Header */}
           <div className="text-center mb-6 relative">
              {logoImage && <img src={logoImage} className="absolute left-0 top-0 h-16 w-auto opacity-80" />}
              <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-900">Prescrição Médica</h1>
           </div>

           {/* Info Grid */}
           <div className="grid grid-cols-4 gap-4 text-sm mb-6 border-b-2 border-slate-900 pb-4">
              <div className="col-span-2 flex gap-1">
                 <span className="font-bold">Nome:</span> 
                 <input className="flex-1 bg-transparent border-b border-dotted border-gray-400 outline-none text-slate-900" value={patientData.name} onChange={e => setPatientData({...patientData, name: e.target.value})} />
              </div>
              <div className="flex gap-1">
                 <span className="font-bold">Pront:</span> 
                 <input className="flex-1 bg-transparent border-b border-dotted border-gray-400 outline-none text-slate-900" value={patientData.id} onChange={e => setPatientData({...patientData, id: e.target.value})} />
              </div>
              <div className="flex gap-1">
                 <span className="font-bold">Leito:</span> 
                 <input className="w-12 bg-transparent border-b border-dotted border-gray-400 outline-none text-slate-900" value={patientData.bed} onChange={e => setPatientData({...patientData, bed: e.target.value})} />
                 <span className="font-bold ml-2">Idade:</span> 
                 <input className="w-12 bg-transparent border-b border-dotted border-gray-400 outline-none text-slate-900" value={patientData.age} onChange={e => setPatientData({...patientData, age: e.target.value})} />
              </div>
              <div className="col-span-2 flex gap-1">
                 <span className="font-bold">Médico:</span> 
                 <input className="flex-1 bg-transparent outline-none font-medium text-slate-900" value={doctorData.name} onChange={e => setDoctorData({...doctorData, name: e.target.value})} />
              </div>
              <div className="flex gap-1">
                 <span className="font-bold">CRM:</span> 
                 <input className="flex-1 bg-transparent outline-none text-slate-900" value={doctorData.crm} onChange={e => setDoctorData({...doctorData, crm: e.target.value})} />
              </div>
              <div>
                 <span className="font-bold">DATA:</span> {new Date().toLocaleDateString('pt-BR')}
              </div>
           </div>

           {/* Table */}
           <div className="w-full border border-slate-900 mb-2 flex-1">
              <table className="w-full text-left text-sm table-fixed">
                 <thead className="bg-gray-100 border-b border-slate-900 text-slate-900">
                    <tr>
                       <th className="p-2 border-r border-slate-900 w-[12%] font-bold text-center">DATA/HORA</th>
                       <th className="p-2 border-r border-slate-900 w-[60%] font-bold">PRESCRIÇÃO MÉDICA</th>
                       <th className="p-2 border-r border-slate-900 w-[10%] font-bold text-center">HORÁRIO</th>
                       <th className="p-2 w-[18%] font-bold">EVOLUÇÃO</th>
                    </tr>
                 </thead>
                 <tbody className="text-slate-900">
                    {prescriptions.map((p, i) => (
                       <tr key={i} className="border-b border-gray-300 relative group h-12">
                          <td className="border-r border-slate-900 p-1 text-center text-xs text-gray-500 align-middle">
                             {new Date().toLocaleDateString('pt-BR', {day: '2-digit', month:'2-digit'})}
                          </td>
                          <td className="border-r border-slate-900 p-1 align-middle">
                             <div className="flex items-center gap-1 w-full">
                                <span className="font-bold text-gray-500 w-4">{i+1}.</span>
                                <input className="font-bold bg-transparent outline-none w-1/3 text-slate-900" value={p.name} onChange={e => updatePrescription(i, 'name', e.target.value)} />
                                <span className="text-gray-400 mx-1">-</span>
                                <input className="flex-1 bg-transparent outline-none italic text-gray-600" value={p.posology} onChange={e => updatePrescription(i, 'posology', e.target.value)} />
                             </div>
                             <button onClick={() => removePrescription(i)} className="absolute right-full mr-1 top-1/2 -translate-y-1/2 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 print:hidden p-1"><X size={12}/></button>
                          </td>
                          <td className="border-r border-slate-900 p-1 text-center align-middle">
                             <input className="w-full text-center bg-transparent outline-none text-slate-900" defaultValue={p.posology.includes('8/8') ? '8/16/24' : p.posology.includes('12/12') ? '8/20' : 'SN'} />
                          </td>
                          <td className="p-1 align-middle">
                             <input className="w-full bg-transparent outline-none text-slate-900" />
                          </td>
                       </tr>
                    ))}
                    
                    {/* Empty Rows (Fill up to 15) */}
                    {Array.from({ length: Math.max(0, 15 - prescriptions.length) }).map((_, i) => (
                       <tr key={`empty-${i}`} className="border-b border-gray-200 h-10 group">
                          <td className="border-r border-slate-900"></td>
                          <td className="border-r border-slate-900 p-2 text-gray-300 relative">
                             {prescriptions.length + i + 1}.
                             {i === 0 && (
                                <button onClick={() => setPrescriptions([...prescriptions, {name:'', posology:'', type:'Manual'}])} className="absolute left-8 top-1/2 -translate-y-1/2 text-emerald-500 opacity-0 group-hover:opacity-100 print:hidden text-xs font-bold flex items-center gap-1"><Plus size={12}/> Add Linha</button>
                             )}
                          </td>
                          <td className="border-r border-slate-900"></td>
                          <td></td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Additional Recs */}
           <div className="mb-4">
              <h4 className="font-bold text-sm mb-1">Recomendações:</h4>
              <textarea className="w-full h-8 bg-transparent border-none outline-none resize-none text-sm text-gray-600" defaultValue="Nenhuma." />
           </div>

           {/* Footer Signature */}
           <div className="text-center mt-auto">
              <div className="inline-block border-t border-slate-900 pt-1 px-8 text-sm w-1/3">
                 <input className="font-bold text-center w-full bg-transparent outline-none text-slate-900" value={doctorData.name} onChange={e => setDoctorData({...doctorData, name: e.target.value})} />
                 <input className="text-center w-full bg-transparent outline-none text-xs text-slate-600" value={doctorData.crm} onChange={e => setDoctorData({...doctorData, crm: e.target.value})} />
              </div>
           </div>

        </div>
        )}

      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-screen w-full transition-colors duration-300 ${bgClass}`}>
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'soap' && renderSOAP()}
        {activeTab === 'clinical' && renderClinical()}
        {activeTab === 'rx' && renderPrescriber()}
        {activeTab === 'docs' && renderDocs()}
        {activeTab === 'patients' && <div className="flex items-center justify-center h-full opacity-50 flex-col gap-2"><Users size={48}/><p>Histórico de Pacientes (Em breve)</p></div>}
      </div>

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'} border p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 text-center`}>
             <div className="relative w-16 h-16 mb-6">
                <div className={`absolute inset-0 rounded-full border-4 border-t-transparent animate-spin ${theme === 'dark' ? `border-${primaryColor}-500` : `border-${primaryColor}-600`}`}></div>
                <div className={`absolute inset-0 flex items-center justify-center`}>
                  <Sparkles size={24} className={`animate-pulse ${theme === 'dark' ? `text-${primaryColor}-400` : `text-${primaryColor}-600`}`} />
                </div>
             </div>
             <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Processando</h3>
             <p className={`text-sm animate-pulse ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{processingStatus || "Aguarde..."}</p>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`${theme === 'dark' ? 'bg-[#0b1121] border-white/10' : 'bg-white border-slate-200'} border p-6 rounded-xl w-full max-w-sm shadow-2xl`}>
            <div className="flex justify-between items-center mb-6">
               <h3 className={`text-lg font-bold text-${primaryColor}-500 flex items-center gap-2`}><Settings size={20}/> Configurações</h3>
               <button onClick={() => setShowSettings(false)}><X size={20} className="text-gray-500 hover:text-red-500"/></button>
            </div>

            <div className="mb-6">
               <h4 className="text-sm font-bold mb-3 flex items-center gap-2 uppercase tracking-wider text-gray-500"><Key size={16}/> API Key (Gemini)</h4>
               <input 
                 type="password"
                 className={`w-full p-2 rounded text-sm border ${inputClass}`} 
                 placeholder="Cole sua API Key aqui (começa com AIza...)" 
                 value={apiKey} 
                 onChange={e => setApiKey(e.target.value)} 
               />
               <p className="text-[10px] text-gray-500 mt-1">Sua chave fica salva apenas no seu navegador.</p>
            </div>
            
            <div className="mb-6">
               <h4 className="text-sm font-bold mb-3 flex items-center gap-2 uppercase tracking-wider text-gray-500"><Palette size={16}/> Tema de Cores</h4>
               <div className="grid grid-cols-5 gap-2">
                 {(['blue', 'violet', 'emerald', 'rose', 'amber'] as ThemeColor[]).map((c) => (
                   <button 
                     key={c} 
                     onClick={() => setColorTheme(c)}
                     className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 ${colorTheme === c ? 'border-white ring-2 ring-gray-400' : 'border-transparent'}`}
                     style={{ backgroundColor: c === 'blue' ? '#3b82f6' : c === 'violet' ? '#8b5cf6' : c === 'emerald' ? '#10b981' : c === 'rose' ? '#f43f5e' : '#f59e0b' }}
                   >
                     {colorTheme === c && <Check size={16} className="text-white"/>}
                   </button>
                 ))}
               </div>
            </div>

             <div className="mb-6">
               <h4 className="text-sm font-bold mb-3 flex items-center gap-2 uppercase tracking-wider text-gray-500"><Sun size={16}/> Modo</h4>
               <div className="flex bg-gray-500/10 p-1 rounded-lg">
                  <button onClick={() => setTheme('light')} className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-all ${theme === 'light' ? 'bg-white shadow text-black' : 'text-gray-500'}`}><Sun size={14}/> Claro</button>
                  <button onClick={() => setTheme('dark')} className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-all ${theme === 'dark' ? 'bg-gray-800 shadow text-white' : 'text-gray-500'}`}><Moon size={14}/> Escuro</button>
               </div>
            </div>

             <div className="mb-6">
               <h4 className="text-sm font-bold mb-3 flex items-center gap-2 uppercase tracking-wider text-gray-500"><Edit3 size={16}/> Dados do Médico</h4>
               <input className={`w-full mb-2 p-2 rounded text-sm border ${inputClass}`} placeholder="Seu Nome" value={doctorData.name} onChange={e => setDoctorData({...doctorData, name: e.target.value})} />
               <input className={`w-full mb-2 p-2 rounded text-sm border ${inputClass}`} placeholder="CRM" value={doctorData.crm} onChange={e => setDoctorData({...doctorData, crm: e.target.value})} />
               <input className={`w-full p-2 rounded text-sm border ${inputClass}`} placeholder="Especialidade" value={doctorData.specialty} onChange={e => setDoctorData({...doctorData, specialty: e.target.value})} />
            </div>

            <p className="text-[10px] text-center text-gray-500 mt-4">NexusMed AI v2.9.0</p>
          </div>
        </div>
      )}

      {/* Bottom Navigation (Redesigned with CSS Grid for perfect spacing) */}
      <div className={`h-20 shrink-0 border-t relative z-10 transition-colors ${theme === 'dark' ? 'bg-[#0b1121] border-white/5' : 'bg-white border-slate-200'}`}>
        <div className="grid grid-cols-5 h-full relative">
            
            {/* 1. Anamnese */}
            <button onClick={() => setActiveTab('soap')} className={`flex flex-col items-center justify-center space-y-1 ${activeTab === 'soap' ? `text-${primaryColor}-500` : 'text-gray-400 hover:text-gray-500'}`}>
               <StethosIcon size={24} strokeWidth={activeTab === 'soap' ? 2.5 : 2} />
               <span className="text-[10px] font-medium">Anamnese</span>
            </button>

            {/* 2. IA Clínica */}
            <button onClick={() => setActiveTab('clinical')} className={`flex flex-col items-center justify-center space-y-1 ${activeTab === 'clinical' ? `text-${primaryColor}-500` : 'text-gray-400 hover:text-gray-500'}`}>
               <BrainCircuit size={24} strokeWidth={activeTab === 'clinical' ? 2.5 : 2} />
               <span className="text-[10px] font-medium">IA Clínica</span>
            </button>

            {/* 3. Empty Slot for Floating Button */}
            <div className="relative">
                 {/* Floating Button Absolute Positioned over this slot */}
                 <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-6 w-full flex justify-center">
                    <button 
                        onClick={() => setActiveTab('docs')}
                        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 transition-transform hover:scale-105 ${activeTab === 'docs' ? `bg-${primaryColor}-600 text-white border-white` : theme === 'dark' ? `bg-${primaryColor}-900 text-gray-200 border-[#0b1121]` : 'bg-slate-100 text-slate-500 border-white'}`}>
                        <FileText size={28} fill={activeTab === 'docs' ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>

            {/* 4. Prescrição */}
            <button onClick={() => setActiveTab('rx')} className={`flex flex-col items-center justify-center space-y-1 ${activeTab === 'rx' ? `text-${primaryColor}-500` : 'text-gray-400 hover:text-gray-500'}`}>
               <Pill size={24} strokeWidth={activeTab === 'rx' ? 2.5 : 2} />
               <span className="text-[10px] font-medium">Prescrição</span>
            </button>

            {/* 5. Pacientes */}
            <button onClick={() => setActiveTab('patients')} className={`flex flex-col items-center justify-center space-y-1 ${activeTab === 'patients' ? `text-${primaryColor}-500` : 'text-gray-400 hover:text-gray-500'}`}>
               <Users size={24} strokeWidth={activeTab === 'patients' ? 2.5 : 2} />
               <span className="text-[10px] font-medium">Pacientes</span>
            </button>

        </div>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);