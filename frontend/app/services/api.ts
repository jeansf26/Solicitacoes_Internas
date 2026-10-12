import { get } from "http";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginRequest(email: string, senha: string) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || 'Erro ao realizar login');
    }

    return data; // Retorna o token gerado pela API PHP
  } catch (error: any) {
    throw new Error(error.message || 'Erro de conexão com o servidor');
  }
}

export async function solicitacaoRequest(params: string = '') {
  try {
    const token = sessionStorage.getItem('token');

    // Concatena os parâmetros de filtro na URL se eles existirem
    const url = params ? `${API_URL}/solicitacoes/?${params}` : `${API_URL}/solicitacoes/`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || 'Erro ao buscar solicitações');
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Erro de conexão com o servidor');
  }
}

export async function solicitacaoIndividualRequest(id : Number) {
  try {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${API_URL}/solicitacoes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || 'Erro ao buscar solicitações');
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Erro de conexão com o servidor');
  }
}

export async function solicitacaoCadastroRequest(titulo: String, descricao: String, area: String, prioridade: String, status: String, comentario: String ) {
  try {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${API_URL}/solicitacoes/cadastrar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      // CORRIGIDO: O body fica fora dos headers
      body: JSON.stringify({ titulo, descricao, area, prioridade, status, comentario }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || 'Erro ao cadastrar solicitação');
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Erro de conexão com o servidor');
  }
}

export async function solicitacaoUpdateRequest(id : Number, titulo: String, descricao: String, area: String, prioridade: String, status: String, comentario: String ) {
  try {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${API_URL}/solicitacoes/update/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ token,
      },
      body: JSON.stringify({ titulo, descricao, area, prioridade, status, comentario }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || 'Erro ao buscar solicitações');
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Erro de conexão com o servidor');
  }
}

export async function solicitacaoDeleteRequest(id : Number) {
  try {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${API_URL}/solicitacoes/delete/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || 'Erro ao buscar solicitações');
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Erro de conexão com o servidor');
  }
}

export async function dashboardRequest() {
  try {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${API_URL}/solicitacoes/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || 'Erro ao carregar o dashboard');
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Erro de conexão com o servidor');
  }
}
