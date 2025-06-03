"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { GuardianInfoView } from "./components/GuardianInfoView"
import { GuardianInfoForm } from "./components/GuardianInfoForm"
import { StudentCard } from "./components/StudentCard"
import { useProfileForm } from "./hooks/useProfileForm"

export default function ProfilePage() {
  const {
    formData,
    loading,
    userLoading,
    isEditMode,
    setIsEditMode,
    updateFormData,
    handleStudentGradeChange,
    updateStudent,
    addStudent,
    removeStudent,
    resetForm,
    handleSubmit,
    guardian
  } = useProfileForm()

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <Card>
        <CardHeader className="relative">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Información del Apoderado</CardTitle>
              <CardDescription>
                {isEditMode 
                  ? "Complete su información y la de sus hijos para continuar."
                  : "Visualice y actualice su información y la de sus hijos cuando necesite."}
              </CardDescription>
            </div>
            {!userLoading && guardian && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditMode(!isEditMode)}
                className="absolute top-4 right-4"
              >
                {isEditMode ? "Cancelar edición" : "Editar información"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 relative">
              {/* Panel de vista de solo lectura */}
              {!isEditMode && guardian && (
                <GuardianInfoView 
                  guardian={guardian} 
                  onEditClick={() => setIsEditMode(true)} 
                />
              )}
              
              {/* Formulario editable */}
              {isEditMode && (
                <GuardianInfoForm 
                  formData={formData} 
                  onChange={updateFormData} 
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-medium">Estudiantes ({formData.students.length})</h3>
                {isEditMode && (
                  <Button type="button" variant="outline" onClick={addStudent}>
                    Agregar Estudiante
                  </Button>
                )}
              </div>

              <div className="grid gap-6">
                {formData.students.map((student, index) => (
                  <StudentCard 
                    key={index}
                    student={student}
                    index={index}
                    isEditMode={isEditMode}
                    canRemove={formData.students.length > 1}
                    onRemove={removeStudent}
                    onChange={updateStudent}
                    onGradeChange={handleStudentGradeChange}
                    isStaff={formData.isStaff}
                  />
                ))}
              </div>
            </div>

            {isEditMode && (
              <div className="flex flex-col gap-3 md:flex-row md:gap-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </Button>
                {guardian && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1" 
                    onClick={resetForm}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            )}
            
            {!isEditMode && guardian && (
              <Button 
                type="button" 
                onClick={() => setIsEditMode(true)}
                className="w-full"
              >
                Editar Información
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
