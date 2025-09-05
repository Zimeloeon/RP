declare module '@mui/icons-material' {
  export * from '@mui/icons-material/index';
}

declare module '@mui/icons-material/*' {
  import React from 'react';
  const Icon: React.ComponentType<any>;
  export default Icon;
}
