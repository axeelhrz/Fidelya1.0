export const GRADES = [
  { value: "PK", label: "Pre-Kinder", level: "Pre-Escolar" },
  { value: "K", label: "Kinder", level: "Pre-Escolar" },
  { value: "1", label: "1° Básico", level: "Básica" },
  { value: "2", label: "2° Básico", level: "Básica" },
  { value: "3", label: "3° Básico", level: "Básica" },
  { value: "4", label: "4° Básico", level: "Básica" },
  { value: "5", label: "5° Básico", level: "Básica" },
  { value: "6", label: "6° Básico", level: "Básica" },
  { value: "7", label: "7° Básico", level: "Básica" },
  { value: "8", label: "8° Básico", level: "Básica" },
  { value: "9", label: "1° Medio", level: "Media" },
  { value: "10", label: "2° Medio", level: "Media" },
  { value: "11", label: "3° Medio", level: "Media" },
  { value: "12", label: "4° Medio", level: "Media" },
] as const

export const GRADE_SECTIONS = ["A", "B", "C", "D"] as const

export type Grade = "PK" | "K" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12"
export type Section = typeof GRADE_SECTIONS[number]

export function getLevelForGrade(grade: Grade): string {
  return GRADES.find(g => g.value === grade)?.level || ""
}
