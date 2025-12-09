import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
  
  updateUser: (user) => set({ user })
}));

export const useCartStore = create((set) => ({
  items: [],
  
  addToCart: (template) => set((state) => ({
    items: [...state.items, template]
  })),
  
  removeFromCart: (templateId) => set((state) => ({
    items: state.items.filter(item => item.id !== templateId)
  })),
  
  clearCart: () => set({ items: [] })
}));

export const useTemplateStore = create((set) => ({
  templates: [],
  categories: [],
  loading: false,
  
  setTemplates: (templates) => set({ templates }),
  setCategories: (categories) => set({ categories }),
  setLoading: (loading) => set({ loading })
}));