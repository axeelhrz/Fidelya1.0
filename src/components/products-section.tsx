                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}>
                    <Typography variant="h5" component="h3" fontWeight={700}>
                      {product.name}
                    </Typography>
                    <Chip 
                      label={product.stats} 
                      size="small"
                      sx={{ 
                        background: theme.palette.mode === "dark" 
                          ? "rgba(0, 112, 243, 0.15)" 
                          : "rgba(0, 112, 243, 0.1)",
                        color: "primary.main",
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {product.description}
                  </Typography>
                  
                  <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<IconEye size={18} />}
                      onClick={() => handleOpenDialog(product)}
                      sx={{ 
                        flexGrow: 1,
                        fontWeight: 500,
                      }}
                    >
                      Ver demo
                    </Button>
                    
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<IconExternalLink size={18} />}
                      href={product.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        flexGrow: 1,
                        fontWeight: 500,
                      }}
                    >
                      Comprar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* Modal de demo */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          {selectedProduct && (
            <>
              <DialogTitle sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                p: 3,
              }}>
                <Typography variant="h5" component="h2" fontWeight={600}>
                  {selectedProduct.name}
                </Typography>
                <IconButton onClick={handleCloseDialog} edge="end">
                  <IconX size={20} />
                </IconButton>
              </DialogTitle>
              
              <DialogContent dividers sx={{ p: 4 }}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Box 
                      component="img"
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      sx={{ 
                        width: "100%",
                        height: "auto",
                        borderRadius: 2,
                        mb: 2,
                      }}
                    />
                    
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {selectedProduct.price}
                    </Typography>
                    
                    <Typography variant="body1" paragraph>
                      {selectedProduct.description}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Características
                    </Typography>
                    
                    <Box component="ul" sx={{ pl: 2, mb: 4 }}>
                      {selectedProduct.features.map((feature, index) => (
                        <Box 
                          component="li" 
                          key={index} 
                          sx={{ 
                            mb: 1,
                            color: "text.secondary",
                          }}
                        >
                          {feature}
                        </Box>
                      ))}
                    </Box>
                    
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      href={selectedProduct.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      endIcon={<IconExternalLink size={18} />}
                      sx={{ 
                        mb: 2,
                        py: 1.5,
                        fontWeight: 500,
                      }}
                    >
                      Ver demo completa
                    </Button>
                    
                    <Button
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      size="large"
                      href={selectedProduct.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        py: 1.5,
                        fontWeight: 500,
                      }}
                    >
                      Comprar en Gumroad
                    </Button>
                  </Grid>
                </Grid>
              </DialogContent>
              
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={handleCloseDialog} color="inherit">
                  Cerrar
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
}