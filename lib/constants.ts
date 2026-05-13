import { 
  Rocket, 
  Briefcase, 
  Palette, 
  Book, 
  Zap, 
  Lightbulb, 
  Target, 
  Trophy 
} from "lucide-react";

export const WORKSPACE_ICONS = [
  { id: "rocket", icon: Rocket },
  { id: "briefcase", icon: Briefcase },
  { id: "palette", icon: Palette },
  { id: "book", icon: Book },
  { id: "zap", icon: Zap },
  { id: "lightbulb", icon: Lightbulb },
  { id: "target", icon: Target },
  { id: "trophy", icon: Trophy },
];

export const WORKSPACE_ICON_MAP: Record<string, any> = {
  rocket: Rocket,
  briefcase: Briefcase,
  palette: Palette,
  book: Book,
  zap: Zap,
  lightbulb: Lightbulb,
  target: Target,
  trophy: Trophy,
};
