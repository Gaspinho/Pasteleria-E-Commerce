import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  design: {
    layer_id: null,
    spongeflavor_id: null,
    icing_id: null,
    imagetopdecoration_id: null,
    msg_on_cake: '',
    msg_color_id: null,
    special_instruction: '',
    amount: 0,
    // Metadatos para el preview
    shape_id: null,
    layer_number: null,
    flavor_name: '',
    icing_name: '',
    decoration_image: '',
    msg_color_code: '#000000'
  },
  currentStep: 1,
  totalSteps: 7,
  savedDesignId: null,
  isLoading: false,
  error: null,
  // Precios base
  basePrice: 0,
  deliveryCharge: 5000,
};

const customCakeSlice = createSlice({
  name: 'customCake',
  initialState,
  reducers: {
    // Navegación de pasos
    nextStep: (state) => {
      if (state.currentStep < state.totalSteps) {
        state.currentStep += 1;
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    goToStep: (state, action) => {
      if (action.payload >= 1 && action.payload <= state.totalSteps) {
        state.currentStep = action.payload;
      }
    },

    // Selecciones de diseño
    setLayer: (state, action) => {
      state.design.layer_id = action.payload.id;
      state.design.shape_id = action.payload.shape_id;
      state.design.layer_number = action.payload.layer_number;
      state.basePrice = action.payload.price;
      state.design.amount = action.payload.price;
    },
    
    setFlavor: (state, action) => {
      state.design.spongeflavor_id = action.payload.id;
      state.design.flavor_name = action.payload.name;
    },
    
    setIcing: (state, action) => {
      state.design.icing_id = action.payload.id;
      state.design.icing_name = action.payload.name;
    },
    
    setDecoration: (state, action) => {
      state.design.imagetopdecoration_id = action.payload.id;
      state.design.decoration_image = action.payload.image;
    },
    
    setMessage: (state, action) => {
      state.design.msg_on_cake = action.payload;
    },
    
    setMessageColor: (state, action) => {
      state.design.msg_color_id = action.payload.id;
      state.design.msg_color_code = action.payload.color_code;
    },
    
    setSpecialInstructions: (state, action) => {
      state.design.special_instruction = action.payload;
    },

    // Manejo de estado
    setSavedDesignId: (state, action) => {
      state.savedDesignId = action.payload;
    },
    
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Reset
    resetDesign: (state) => {
      state.design = initialState.design;
      state.currentStep = 1;
      state.savedDesignId = null;
      state.basePrice = 0;
      state.error = null;
    },

    // Cargar diseño guardado (desde localStorage o BD)
    loadDesign: (state, action) => {
      state.design = { ...state.design, ...action.payload };
    },

    // Calcular total
    calculateTotal: (state) => {
      state.design.amount = state.basePrice;
    }
  },
});

export const {
  nextStep,
  previousStep,
  goToStep,
  setLayer,
  setFlavor,
  setIcing,
  setDecoration,
  setMessage,
  setMessageColor,
  setSpecialInstructions,
  setSavedDesignId,
  setLoading,
  setError,
  resetDesign,
  loadDesign,
  calculateTotal
} = customCakeSlice.actions;

export default customCakeSlice.reducer;
