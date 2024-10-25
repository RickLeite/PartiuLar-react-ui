import { createContext, useContext, useState } from 'react';

// Criando o contexto do usuário
const UserContext = createContext();

// Provedor do contexto, que vai encapsular os componentes da aplicação
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado para armazenar o usuário

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

