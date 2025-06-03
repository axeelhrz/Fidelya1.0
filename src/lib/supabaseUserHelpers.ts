import { supabase } from "@/lib/supabase/client"
import { Guardian, Student } from "@/context/UserContext"

// Actualiza o inserta datos en la tabla 'clientes' y su campo de hijos (students)
export async function upsertClienteConHijos(
  userId: string,
  clienteData: {
    nombre_apoderado: string,
    correo_apoderado: string,
    telefono_apoderado: string,
    es_funcionario: boolean
  },
  hijos: (Partial<Student> & { id?: string })[]
): Promise<void> {
  // Upsert cliente, guardando los hijos como JSON en el campo correspondiente
  const { error: upsertError } = await supabase
    .from("clientes")
    .upsert({
      user_id: userId,
      nombre_apoderado: clienteData.nombre_apoderado,
      correo_apoderado: clienteData.correo_apoderado,
      telefono_apoderado: clienteData.telefono_apoderado,
      es_funcionario: clienteData.es_funcionario,
      hijos: hijos.length > 0 ? hijos : [],
    }, { onConflict: "user_id" })
  if (upsertError) throw upsertError
}

