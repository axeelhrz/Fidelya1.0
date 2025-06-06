      </CardContent>

      {/* Modal para agregar hijo (placeholder) */}
      {showAddChild && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Agregar Hijo</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Para agregar un nuevo hijo, ve a tu perfil y actualiza la información de tus hijos.
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowAddChild(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={() => {
                  setShowAddChild(false)
                  // Aquí podrías redirigir a /perfil
                }}
                className="flex-1"
              >
                Ir a Perfil
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
