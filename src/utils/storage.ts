import type { Usuario, Examen, IntentoExamen, Certificado } from '../types';

const STORAGE_KEYS = {
  USUARIOS: 'daw_cert_usuarios',
  EXAMENES: 'daw_cert_examenes',
  INTENTOS: 'daw_cert_intentos',
  CERTIFICADOS: 'daw_cert_certificados',
  CURRENT_USER_ID: 'daw_cert_current_user_id',
};

// Seed Data
const SEMILLA_USUARIOS: Usuario[] = [
  {
    id: 'usr-1',
    nombreCompleto: 'Docente Evaluador 1',
    email: 'docente.evaluador@universidad.edu.pe',
    documento: '10203040',
    especialidad: 'Ingeniería de Sistemas y Computación',
    bio: 'Profesor principal de cátedra. Especialista en arquitecturas de software y metodologías ágiles en el desarrollo.',
    experiencia: [
      {
        id: 'exp-11',
        empresa: 'Universidad de la Región',
        puesto: 'Profesor Principal de Desarrollo Web',
        fechaInicio: '2018-03',
        fechaFin: 'Presente',
        descripcion: 'Docencia universitaria sobre arquitecturas y desarrollo con stacks modernos.',
      },
      {
        id: 'exp-12',
        empresa: 'TechSoluciones S.A.C.',
        puesto: 'Arquitecto de Software Senior',
        fechaInicio: '2012-05',
        fechaFin: '2018-02',
        descripcion: 'Diseño de microservicios e integración de arquitecturas en la nube.',
      }
    ],
    educacion: [
      {
        id: 'edu-11',
        institucion: 'Universidad Nacional de Postgrado',
        titulo: 'Maestría en Ingeniería de Software',
        fechaGrado: '2015-12',
      },
      {
        id: 'edu-12',
        institucion: 'Universidad de la Región',
        titulo: 'Ingeniero de Sistemas',
        fechaGrado: '2008-07',
      }
    ]
  },
  {
    id: 'usr-2',
    nombreCompleto: 'Estudiante Postulante 1',
    email: 'estudiante.postulante1@universidad.edu.pe',
    documento: '74839201',
    especialidad: 'Desarrollo Frontend React',
    bio: 'Estudiante universitario de Ingeniería de Sistemas interesado en desarrollo de interfaces web e integraciones funcionales.',
    experiencia: [
      {
        id: 'exp-21',
        empresa: 'Vortex Tech',
        puesto: 'Practicante de Desarrollo Frontend',
        fechaInicio: '2025-01',
        fechaFin: 'Presente',
        descripcion: 'Maquetación de interfaces responsivas y consumo de servicios usando React.',
      }
    ],
    educacion: [
      {
        id: 'edu-21',
        institucion: 'Universidad de la Región',
        titulo: 'Estudiante de Ingeniería de Sistemas',
        fechaGrado: '2026-12',
      }
    ]
  }
];

const SEMILLA_EXAMENES: Examen[] = [
  {
    id: 'exm-1',
    titulo: 'Certificación Profesional en React & TypeScript',
    areaTematica: 'Desarrollo Web Frontend',
    tipoPredominante: 'multiple',
    porcentajeAprobacion: 80,
    creadoEn: '2026-05-20',
    preguntas: [
      {
        id: 'q1-1',
        texto: '¿Cuál es el beneficio principal de utilizar TypeScript junto con React?',
        tipo: 'multiple',
        opciones: [
          'TypeScript hace que la aplicación corra más rápido en el navegador.',
          'Permite tipado estático estricto, reduciendo errores en tiempo de desarrollo y auto-documentando los props de los componentes.',
          'Elimina la necesidad de utilizar estados en React.',
          'Permite renderizar componentes en el servidor sin usar Node.js.'
        ],
        respuestaCorrecta: 1,
        puntos: 4
      },
      {
        id: 'q1-2',
        texto: '¿Cuál es la función del hook useEffect en React?',
        tipo: 'multiple',
        opciones: [
          'Optimizar el renderizado de listas complejas.',
          'Modificar el estado de un componente de manera sincrónica.',
          'Ejecutar efectos secundarios en componentes funcionales (suscripciones, peticiones HTTP, manipulación de DOM).',
          'Almacenar valores persistentes entre renders sin disparar un nuevo renderizado.'
        ],
        respuestaCorrecta: 2,
        puntos: 4
      },
      {
        id: 'q1-3',
        texto: 'Al usar Local Storage en una aplicación web, los datos guardados...',
        tipo: 'multiple',
        opciones: [
          'Se eliminan automáticamente al cerrar la pestaña o el navegador.',
          'Se guardan de forma encriptada por defecto.',
          'Persisten indefinidamente hasta que sean explícitamente borrados mediante código o limpiando los datos del navegador.',
          'Solo se pueden leer desde el servidor.'
        ],
        respuestaCorrecta: 2,
        puntos: 4
      },
      {
        id: 'q1-4',
        texto: 'En React, ¿qué es la "reconciliación"?',
        tipo: 'multiple',
        opciones: [
          'El proceso mediante el cual React actualiza el DOM real basándose en los cambios del Virtual DOM de manera eficiente.',
          'La sincronización de estados entre diferentes navegadores del cliente.',
          'El proceso de compilar archivos TSX a Javascript.',
          'La resolución de conflictos en el archivo package.json.'
        ],
        respuestaCorrecta: 0,
        puntos: 4
      },
      {
        id: 'q1-5',
        texto: '¿Para qué sirve el hook useMemo?',
        tipo: 'multiple',
        opciones: [
          'Para persistir un estado en Local Storage de manera automática.',
          'Para memorizar el resultado de un cálculo costoso y evitar que se ejecute en cada render a menos que cambien sus dependencias.',
          'Para crear una referencia mutable al DOM.',
          'Para manejar transiciones animadas complejas.'
        ],
        respuestaCorrecta: 1,
        puntos: 4
      }
    ]
  },
  {
    id: 'exm-2',
    titulo: 'Evaluación Avanzada en Arquitectura de Software',
    areaTematica: 'Ingeniería de Software',
    tipoPredominante: 'mixto',
    porcentajeAprobacion: 70,
    creadoEn: '2026-05-24',
    preguntas: [
      {
        id: 'q2-1',
        texto: 'En una arquitectura limpia (Clean Architecture), ¿cuál de las siguientes capas contiene las reglas de negocio principales y entidades de la aplicación?',
        tipo: 'multiple',
        opciones: [
          'La capa de Adaptadores de Presentación (Controllers/Presenters).',
          'La capa del Núcleo (Core/Domain) que incluye Entidades y Casos de Uso.',
          'La capa de Infraestructura (Base de datos, servicios web externos).',
          'La capa de Frameworks y Controladores de UI.'
        ],
        respuestaCorrecta: 1,
        puntos: 5
      },
      {
        id: 'q2-2',
        texto: '¿Qué principio de SOLID se viola si una clase derivada modifica el comportamiento esperado de su clase base de modo que el cliente obtiene resultados inconsistentes al sustituirla?',
        tipo: 'multiple',
        opciones: [
          'Principio de Responsabilidad Única (SRP)',
          'Principio de Abierto/Cerrado (OCP)',
          'Principio de Sustitución de Liskov (LSP)',
          'Principio de Segregación de Interfaces (ISP)'
        ],
        respuestaCorrecta: 2,
        puntos: 5
      },
      {
        id: 'q2-3',
        texto: 'Describa brevemente en qué consiste el patrón de diseño "Observer" y brinde un ejemplo real de su aplicación en el desarrollo de software moderno.',
        tipo: 'abierta',
        respuestaModelo: 'El patrón Observer define una relación de dependencia de uno a muchos entre objetos, de manera que cuando un objeto cambia su estado, todos sus dependientes son notificados y actualizados automáticamente. Un ejemplo real es el manejo de eventos en interfaces gráficas (EventListeners), los flujos reactivos (RxJS) o el patrón publicador-suscriptor en arquitecturas orientadas a eventos.',
        palabrasClave: ['notific', 'observador', 'evento', 'suscriptor', 'dependencia', 'patron', 'cambio', 'actualiza'],
        puntos: 10
      }
    ]
  }
];

export const storage = {
  // Inicialización de semillas
  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.USUARIOS)) {
      localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(SEMILLA_USUARIOS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EXAMENES)) {
      localStorage.setItem(STORAGE_KEYS.EXAMENES, JSON.stringify(SEMILLA_EXAMENES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INTENTOS)) {
      localStorage.setItem(STORAGE_KEYS.INTENTOS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CERTIFICADOS)) {
      localStorage.setItem(STORAGE_KEYS.CERTIFICADOS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'usr-2'); // Briza como usuario activo por defecto
    }
  },

  // Usuarios
  getUsuarios: (): Usuario[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USUARIOS);
    return data ? JSON.parse(data) : [];
  },

  saveUsuarios: (usuarios: Usuario[]) => {
    localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(usuarios));
  },

  addUsuario: (usuario: Usuario): boolean => {
    const usuarios = storage.getUsuarios();
    const existeDoc = usuarios.some(u => u.documento === usuario.documento);
    if (existeDoc) return false;
    
    usuarios.push(usuario);
    storage.saveUsuarios(usuarios);
    return true;
  },

  updateUsuario: (usuario: Usuario) => {
    const usuarios = storage.getUsuarios();
    const index = usuarios.findIndex(u => u.id === usuario.id);
    if (index !== -1) {
      usuarios[index] = usuario;
      storage.saveUsuarios(usuarios);
    }
  },

  getCurrentUserId: (): string => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'usr-2';
  },

  setCurrentUserId: (id: string) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
  },

  // Exámenes
  getExamenes: (): Examen[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EXAMENES);
    return data ? JSON.parse(data) : [];
  },

  saveExamenes: (examenes: Examen[]) => {
    localStorage.setItem(STORAGE_KEYS.EXAMENES, JSON.stringify(examenes));
  },

  addExamen: (examen: Examen) => {
    const examenes = storage.getExamenes();
    examenes.push(examen);
    storage.saveExamenes(examenes);
  },

  updateExamen: (examen: Examen) => {
    const examenes = storage.getExamenes();
    const index = examenes.findIndex(e => e.id === examen.id);
    if (index !== -1) {
      examenes[index] = examen;
      storage.saveExamenes(examenes);
    }
  },

  deleteExamen: (id: string) => {
    const examenes = storage.getExamenes();
    const filtrados = examenes.filter(e => e.id !== id);
    storage.saveExamenes(filtrados);
  },

  // Intentos de examen
  Intentos: {
    get: (): IntentoExamen[] => {
      const data = localStorage.getItem(STORAGE_KEYS.INTENTOS);
      return data ? JSON.parse(data) : [];
    },

    save: (intentos: IntentoExamen[]) => {
      localStorage.setItem(STORAGE_KEYS.INTENTOS, JSON.stringify(intentos));
    },

    add: (intento: IntentoExamen) => {
      const intentos = storage.Intentos.get();
      intentos.push(intento);
      storage.Intentos.save(intentos);
    },

    getUserAttempts: (usuarioId: string): IntentoExamen[] => {
      return storage.Intentos.get().filter(i => i.usuarioId === usuarioId);
    },

    hasUserTakenExam: (usuarioId: string, examenId: string): boolean => {
      return storage.Intentos.get().some(i => i.usuarioId === usuarioId && i.examenId === examenId);
    }
  },

  // Certificados
  Certificados: {
    get: (): Certificado[] => {
      const data = localStorage.getItem(STORAGE_KEYS.CERTIFICADOS);
      return data ? JSON.parse(data) : [];
    },

    save: (certificados: Certificado[]) => {
      localStorage.setItem(STORAGE_KEYS.CERTIFICADOS, JSON.stringify(certificados));
    },

    add: (certificado: Certificado) => {
      const certificados = storage.Certificados.get();
      certificados.push(certificado);
      storage.Certificados.save(certificados);
    },

    getByHash: (hash: string): Certificado | undefined => {
      return storage.Certificados.get().find(c => c.hash === hash);
    },

    getUserCertificados: (usuarioId: string): Certificado[] => {
      return storage.Certificados.get().filter(c => c.usuarioId === usuarioId);
    }
  }
};
