import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import {
  ViewModule as ViewModuleIcon,
  ViewKanban as ViewKanbanIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

interface TaskTabsProps {
  view: 'cards' | 'board';
  onViewChange: (view: 'cards' | 'board') => void;
  disableBoardView?: boolean;
}

export const TaskTabs: React.FC<TaskTabsProps> = ({
  view,
  onViewChange,
  disableBoardView = false,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleChange = (event: React.SyntheticEvent, newValue: 'cards' | 'board') => {
    onViewChange(newValue);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: '16px',
          background: isDark
            ? alpha(theme.palette.background.paper, 0.4)
            : alpha(theme.palette.background.paper, 0.6),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${
            isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
          }`,
          overflow: 'hidden',
        }}
      >
        <Tabs
          value={view}
          onChange={handleChange}
          aria-label="task view tabs"
          sx={{
            minHeight: 48,
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            '& .MuiTabs-flexContainer': {
              gap: 1,
              p: 0.5,
            },
          }}
        >
          <Tab
            value="cards"
            icon={
              <ViewModuleIcon
                sx={{
                  fontSize: 20,
                  mr: 1,
                }}
              />
            }
            label="Tarjetas"
            sx={{
              minHeight: 40,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              color: view === 'cards' ? 'white' : theme.palette.text.secondary,
              background:
                view === 'cards'
                  ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                  : 'transparent',
              '&:hover': {
                background:
                  view === 'cards'
                    ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                    : isDark
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.05)',
                color:
                  view === 'cards' ? 'white' : theme.palette.text.primary,
              },
              transition: 'all 0.3s ease',
            }}
          />
          <Tooltip
            title={
              disableBoardView
                ? 'Vista de tablero disponible en planes Pro y Enterprise'
                : ''
            }
            arrow
          >
            <Box>
              <Tab
                value="board"
                icon={
                  <>
                    <ViewKanbanIcon
                      sx={{
                        fontSize: 20,
                        mr: 1,
                      }}
                    />
                    {disableBoardView && (
                      <LockIcon
                        sx={{
                          fontSize: 14,
                          ml: -1,
                          mb: -0.5,
                          color: theme.palette.warning.main,
                        }}
                      />
                    )}
                  </>
                }
                label="Tablero"
                disabled={disableBoardView}
                sx={{
                  minHeight: 40,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  color: view === 'board' ? 'white' : theme.palette.text.secondary,
                  background:
                    view === 'board'
                      ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                      : 'transparent',
                  '&:hover': {
                    background:
                      view === 'board'
                        ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                        : isDark
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.05)',
                    color:
                      view === 'board' ? 'white' : theme.palette.text.primary,
                  },
                  transition: 'all 0.3s ease',
                  '&.Mui-disabled': {
                    opacity: 0.7,
                    color: theme.palette.text.disabled,
                  },
                }}
              />
            </Box>
          </Tooltip>
        </Tabs>
      </Paper>
    </Box>
  );
};