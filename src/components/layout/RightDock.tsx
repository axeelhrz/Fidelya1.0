                      background: alpha(getPriorityColor(task.prioridad), 0.1),
                      border: `1px solid ${alpha(getPriorityColor(task.prioridad), 0.2)}`,
                    }}
                  >
                    <ListItemIcon>
                      <DragIndicator sx={{ color: 'text.secondary' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          {task.titulo}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {task.descripcion}
                          </Typography>
                          <Box display="flex" gap={0.5} mt={0.5}>
                            {task.etiquetas.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{ fontSize: '0.6rem', height: 16 }}
                              />
                            ))}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Month Tasks */}
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ px: 1, fontWeight: 600 }}>
                Este Mes ({getCategoryTasks('mes').length})
              </Typography>
              <List dense>
                {getCategoryTasks('mes').map((task) => (
                  <ListItem
                    key={task.id}
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      background: alpha(getPriorityColor(task.prioridad), 0.1),
                      border: `1px solid ${alpha(getPriorityColor(task.prioridad), 0.2)}`,
                    }}
                  >
                    <ListItemIcon>
                      <DragIndicator sx={{ color: 'text.secondary' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          {task.titulo}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {task.descripcion}
                          </Typography>
                          <Box display="flex" gap={0.5} mt={0.5}>
                            {task.etiquetas.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{ fontSize: '0.6rem', height: 16 }}
                              />
                            ))}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}
