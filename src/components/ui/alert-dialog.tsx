import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';

// Styled components to match app design
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '1rem',
    padding: '0.5rem',
    fontFamily: "'Tajawal', 'Inter', sans-serif",
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontFamily: "'Cairo', 'Poppins', sans-serif",
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '#2B2B2B',
  padding: '1.5rem 1.5rem 1rem',
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: '0 1.5rem 1.5rem',
}));

const StyledDialogContentText = styled(DialogContentText)(({ theme }) => ({
  fontFamily: "'Tajawal', 'Inter', sans-serif",
  fontSize: '1rem',
  color: '#6F6F6F',
  lineHeight: 1.75,
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: '1rem 1.5rem 1.5rem',
  gap: '0.75rem',
}));

const StyledButton = styled(Button)(({ variant }) => ({
  fontFamily: "'Tajawal', 'Inter', sans-serif",
  borderRadius: '0.75rem',
  padding: '0.5rem 1.5rem',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  ...(variant === 'outlined' ? {
    borderColor: '#E5E5E5',
    color: '#2B2B2B',
    '&:hover': {
      borderColor: '#D0D0D0',
      backgroundColor: '#F9F9F9',
    },
  } : variant === 'contained' ? {
    backgroundColor: '#6CAEBD',
    color: '#fff',
    '&:hover': {
      backgroundColor: 'rgba(108, 174, 189, 0.9)',
    },
  } : {}),
}));

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
  return (
    <StyledDialog
      open={open}
      onClose={() => onOpenChange(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
      fullWidth
      disableRestoreFocus
      disableEnforceFocus={false}
    >
      {children}
    </StyledDialog>
  );
}

// Dummy component for backward compatibility - not used in controlled mode
function AlertDialogTrigger({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function AlertDialogContent({ children, className, ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props}>{children}</div>;
}
function AlertDialogHeader({ children, className, ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props}>{children}</div>;
}

function AlertDialogTitle({ children, className, ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLElement>) {
  return <StyledDialogTitle id="alert-dialog-title" className={className} {...props}>{children}</StyledDialogTitle>;
}

function AlertDialogDescription({ children, className, ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <StyledDialogContent>
      <StyledDialogContentText id="alert-dialog-description" className={className} {...props}>
        {children}
      </StyledDialogContentText>
    </StyledDialogContent>
  );
}

function AlertDialogFooter({ children, className, ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return <StyledDialogActions className={className} {...props}>{children}</StyledDialogActions>;
}

function AlertDialogCancel({ children, onClick, ...props }: React.ComponentProps<typeof Button> & { onClick?: () => void }) {
  return (
    <StyledButton variant="outlined" onClick={onClick} {...props}>
      {children}
    </StyledButton>
  );
}

function AlertDialogAction({ children, className, onClick, ...props }: React.ComponentProps<typeof Button> & { onClick?: () => void }) {
  return (
    <StyledButton 
      variant="contained"
      onClick={onClick}
      autoFocus
      {...props}
    >
      {children}
    </StyledButton>
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
