import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  type: string | null;
  data?: unknown;
}

interface UiState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Modal (single global modal slot)
  modal: ModalState;
  openModal: (type: string, data?: unknown) => void;
  closeModal: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  modal: { isOpen: false, type: null, data: undefined },
  openModal: (type, data) => set({ modal: { isOpen: true, type, data } }),
  closeModal: () => set({ modal: { isOpen: false, type: null, data: undefined } }),
}));
