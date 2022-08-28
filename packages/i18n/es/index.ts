import { Translation } from '../i18n-types'

const es: Translation = {
  main: {
    updater: {
      title: 'Nueva versión disponible {version}',
      message: 'Una nueva version ({version}) de Lindo esta disponible. ¿Quieres descargar la actualización?',
      messageRequired:
        'Está disponible una nueva versión ({version}) obligatoria de Lindo, puedes descárgarla en GitHub.',
      download: 'Descárgarla.',
      ignore: 'Ignorar'
    },
    gameMenu: {
      file: {
        title: 'Aplicación',
        newWindow: 'Nueva Ventana',
        newTab: 'Nueva Pestaña',
        closeTab: 'Cerrar Pestaña',
        closeWindow: 'Salir'
      },
      edit: {
        title: 'Editar',
        undo: 'Deshacer',
        redo: 'Rehacer',
        cut: 'Cortar',
        copy: 'Copiar',
        paste: 'Pegar',
        selectAll: 'Seleccionar todo'
      },
      window: {
        title: 'Ventana',
        reload: 'Recargar',
        prevTab: 'Pestaña anterior',
        nextTab: 'Pestaña siguiente',
        sound: 'Sonido',
        enableSound: 'Activar sonido',
        disableSound: 'Desactivar sonido',
        zoomIn: 'Acercar zoom',
        zoomOut: 'Alejar zoom',
        resetZoom: 'Reiniciar zoom',
        fullScreen: 'Pantalla completa'
      },
      infos: {
        title: '?',
        changelog: 'Registro de cambios',
        console: 'Consola de desarrollador',
        about: 'Sobre nosotros...'
      }
    },
    dialogs: {
      cacheCleared: {
        title: 'Borrar caché',
        message: 'El caché se ha borrado en la ventana actual'
      }
    }
  },
  notifications: {
    fightTurn: 'Inicio de turno {characterName}',
    privateMessage: 'Mensaje de {senderName}',
    taxCollector: 'Un recaudador está siendo atacado',
    kolizeum: '¡Se ha encontrado un Koliseo!',
    partyInvitation: '{senderName} te invita a unirte a su grupo.',
    aggression: '¡Te han agredido!',
    saleMessage: 'Banco'
  },
  window: {
    main: {
      tabsOverflow: {
        text: '"Lindo no admite más de 6 pestañas por ventana, al abrir una pestaña adicional puede ocasionar errores y bugs. Pero puede abrir una nueva ventana y funcionará bien".'
      }
    },
    changelog: {
      title: 'Notas de versión',
      prefix: 'Versión'
    },
    unlockScreen: {
      info: 'Ingrese la contraseña maestra para conectar tus cuentas automáticamente.',
      chooseTeamConnect: 'Elige un Team para conectar',
      connect: 'Conectar',
      masterPassword: 'Contraseña maestra',
      invalidPassword: 'Contraseña invalida',
      unlock: 'Desbloquear',
      skip: 'Saltar'
    },
    updateGame: {
      title: 'Actualización de Lindo',
      step0: 'Preparando actualización..',
      step1: 'Paso 1: Descarga de archivos Dofus',
      step2: 'Paso 2: Descarga los parches Lindo',
      step3: 'Paso 3: Resolución de la versión',
      step4: 'Paso 4: Aplicando parches',
      step5: 'Paso 5: Escribiendo archivos modificados',
      step6: 'Paso 6: Eliminar archivos antiguos',
      step7: 'Paso 7: Finalizando',
      step8: 'Paso 8 : Iniciando Lindo..',
      information: {
        search: 'Comprobando actualizaciones...',
        error: '¡No se puede descargar la actualización! Vuelva a intentarlo más tarde',
        retry: 'Volver a intentar'
      }
    },
    options: {
      title: 'Opciones',
      button: {
        reset: 'Reiniciar Opciones',
        close: 'Cerrar'
      },
      dialogs: {
        resetSettings: {
          title: '¿Restablecer todas las opciones?',
          message: 'A continuación se restablecerán todos los parámetros. Esta operación no es reversible.',
          confirm: 'Reiniciar',
          cancel: 'Cancelar'
        }
      }
    }
  },
  option: {
    general: {
      title: 'General',
      interface: 'Interfaz',
      sound: 'Sonido',
      gameData: 'Datos del juego',
      language: 'Lenguaje',
      resolution: 'Resolución',
      fullScreen: 'Pantalla completa',
      hideTab: 'Ocultar la barra de pestañas multicuenta',
      localContent: 'Habilitar la descarga de mapas locales (beta)',
      soundFocus: 'Sonido del juego solo en la ventana de primer plano',
      early: 'Juega en Dofus Touch Early',
      restart: 'Aplicar y reiniciar',
      resetGame: 'Re-Descargar datos del juego ',
      clearCache: 'Borrar caché'
    },
    shortcuts: {
      title: 'Atajos',
      diver: {
        header: 'Diverso',
        endTurn: 'Termina su turno / Listo (combate)',
        openChat: 'Abrir el chat',
        openMenu: 'Abrir el menú',
        goUp: 'Ir al Mapa superior',
        goDown: 'Ir al Mapa inferior',
        goLeft: 'Ir al Mapa de la izquierda',
        goRight: 'Ir al Mapa de la derecha',
        showMonsterTooltips: 'Mostrar/ocultar información del grupo de monstruos'
      },
      interfaces: {
        header: 'Interfaces',
        carac: 'Personaje',
        spell: 'Hechizos',
        bag: 'Inventario',
        bidHouse: 'Mercadillo',
        map: 'Mapa',
        friend: 'Amigos',
        book: 'Misiones',
        guild: 'Gremio',
        conquest: 'Koliseo',
        goultine: 'Tienda',
        job: 'Oficios',
        alliance: 'Alianza',
        mount: 'Montura',
        directory: 'Directorio de Gremios y Alianzas',
        alignment: 'Alineacion',
        bestiary: 'Bestiario',
        title: 'Título y Ornamentos',
        achievement: 'Logros',
        dailyQuest: 'Misiones Diarias',
        spouse: 'Esposo(a)',
        shop: 'Mercante'
      },
      items: {
        header: 'Objetos',
        slot: 'Casilla {x}'
      },
      application: {
        header: 'Programa',
        newWindow: 'Nueva ventana',
        newTab: 'Nueva pestaña',
        tab: 'Pestaña {x}',
        nextTab: 'Pestaña siguiente',
        prevTab: 'Pestaña anterior'
      },
      spells: {
        header: 'Hechizos',
        slot: 'Ubicación {x}'
      },
      mods: {
        header: 'Mods',
        mapResources: 'Mostrar/Ocultar recursos',
        healthBar: 'Mostrar/Ocultar barra de vida'
      },
      information:
        'Puede usar las teclas CTRL/CMD, MAYÚS, ESPACIO, ALT. Para ingresar sus accesos directos, presione la combinación de teclas deseada en el campo.',
      error: 'No se puede utilizar esta tecla de acceso directo.'
    },
    features: {
      title: 'Características',
      general: {
        header: 'General',
        hideShop: 'Ocultar el botón Tienda',
        activeOpenMenu: 'Abrir menú cuando no hay ninguna ventana abierta (ESC)',
        disableInactivity: 'Extender el período de inactividad',
        zaapSearchFilter: 'Mostrar filtro de busqueda zaap'
      },
      fight: {
        header: 'Combate',
        healthBar: 'Activa la visualización de las barras de vida debajo de los luchadores.',
        focusFightTurn: 'Cambiar automáticamente a una cuenta cuando inicia su turno',
        estimator: 'Daño estimado de hechizo durante el combate',
        fightChronometer: 'Mostrar el cronómetro durante la pelea',
        monsterTooltip: 'Mostrar información del grupo de monstruos en el mapa',
        monsterTooltipShortcut: 'Acceso directo a la información del grupo de monstruos',
        verticalTimeline: 'Mostrar la línea de tiempo de los luchadores verticalmente',
        challengePercent: 'Mostrar bonificación XP/Drop de desafío'
      },
      group: {
        header: 'Grupo',
        partyMemberOnMap: 'Añadir un indicador para saber si los miembros de un grupo están en el mismo mapa',
        partyInfo: {
          level: 'Mostrar nivel de grupo',
          prospecting: 'Mostrar prospeccion del grupo   '
        },
        autoGroup: {
          header: 'Grupo automático',
          active: 'Activar agrupación automática',
          warning:
            'Ten cuidado, seguir al líder puede ser considerado un BOT para otros jugadores, úsalo con moderación y en áreas despobladas.',
          warningTimer:
            'Tenga cuidado, esta función puede considerarse un BOT para otros jugadores, utilícela con moderación y en áreas despobladas.',
          explanation1: 'Los personajes del grupo deben ser amigos del líder para que la invitación sea automática.',
          explanation2: 'Los miembros siguen al líder si este último está en el mismo mapa.',
          leader: 'Nombre del lider',
          members: 'Nombres de personajes',
          addMember: 'Agregar personaje',
          followLeader: 'Sigue al líder del grupo',
          disableTimer: 'Deshabilitar el Temporizador para el grupo automático',
          ready: 'Saltar "listo" automáticamente',
          fight: 'Entrar en combate automáticamente',
          delay: 'Retraso antes de seguir (en segundos)',
          followOnMap: 'Sigue al líder en un mapa',
          strictMove: 'Mover a la misma casilla que el líder',
          pvpWarning: 'No puedes unirte a una pelea PvP automáticamente'
        }
      },
      job: {
        header: 'Oficios',
        showResources: 'Mostrar recursos del mapa',
        harvestIndicator: 'Barras de tiempo restante debajo de los recursos',
        jobsXp: 'Activar la visualización de los XP necesarios para pasar de nivel(Oficio)'
      },
      accounts: {
        header: 'Cuentas'
      }
    },
    notifications: {
      title: 'Notificaciones',
      description:
        'Puedes recibir notificaciones del juego cuando la aplicación está en segundo plano. Se le notificará:',
      fightTurn: 'Al inicio del turno (combate)',
      privateMessage: 'A la llegada de un mensaje privado',
      taxCollector: 'Cuando un recaudador es atacado',
      kolizeum: 'Cuando se encuentra la pelea de koliseo',
      partyInvitation: 'Cuando alguien te invita a unirte a un grupo',
      aggression: 'Cuando alguien te agrede',
      saleMessage: 'Cuando se vende un objeto'
    },
    multiAccount: {
      title: 'Cuenta Múltiple',
      enable: 'Habilite la cuenta múltiple con su contraseña maestra',
      notConfigured:
        'Para utilizar esta función, se debe configurar una contraseña. Se utilizará para iniciar Lindo con las automatizaciones multicuenta.',
      configurePassword: 'Configurar contraseña',
      addCharacter: 'Agregar personaje',
      newTeam: 'Nuevo Team',
      removePassword: 'Eliminar contraseña',
      changePassword: 'Cambia la contraseña',
      dialogs: {
        characterDialog: {
          title: 'Agregar personaje',
          confirm: 'Añadir',
          cancel: 'Cancelar'
        },
        teamDialog: {
          title: 'Agregar nuevo team',
          teamName: 'Nombre del team',
          addWindow: 'Agregar una ventana',
          confirm: 'Añadir',
          cancel: 'Cancelar'
        },
        selectCharacter: {
          title: 'Selecciona un personaje',
          cancel: 'Cancelar'
        },
        passwordDialog: {
          configurePassword: 'Configurar contraseña maestra',
          changePassword: 'Cambia la contraseña',
          removePassword: '¿Eliminar contraseña?',
          removePasswordInfo: 'La contraseña maestra se eliminará, esto eliminará las cuentas registradas.',
          password: 'Contraseña',
          confirmPassword: 'Confirmar la contraseña',
          oldPassword: 'Contraseña antigua',
          confirmRemovePassword: 'Eliminar contraseña',
          validate: 'Validar',
          cancel: 'Cancelar'
        }
      },
      characterCard: {
        characterImageNotLoaded: 'La imagen del personaje se cargará después de iniciar sesión',
        buttons: {
          select: 'Seleccionar',
          delete: 'Borrar',
          edit: 'Editar',
          remove: 'Remover'
        }
      },
      teamWindowCard: {
        window: 'Ventana {position}',
        addCharacter: 'Agregar personaje'
      },
      teamAccordion: {
        delete: 'Eliminar Team',
        edit: 'Editar Team',
        window: 'Ventana {position}'
      }
    },
    about: {
      title: 'Acerca',
      links: {
        website: 'Sitio web',
        github: 'Github (código fuente)',
        chat: 'Servidor de chat',
        reddit: 'Reddit (foro)',
        changelog: 'Registro de cambios'
      },
      text0: 'Lindo es un software de código abierto que te permite jugar DOFUS Touch desde tu computador.',
      text1:
        'A diferencia de un emulador de Android, el código es interpretado directamente por tu computador, lo que agiliza la lectura y te permite jugar a DOFUS Touch aprovechando al máximo el rendimiento de tu ordenador!',
      text2:
        'Originalmente conocido como DOFUS Touch No-Emu, este software desarrollado por Daniel y Thomas se vio obligado a cerrar sus puertas debido a una advertencia de Ankama.'
    }
  },
  // MODS Texts
  mod: {
    jobXP: {
      xpMissing: '{xp} XP faltante<br>antes del nivel {nextLevel}'
    },
    monsterTooltip: {
      level: 'Nivel',
      group: 'Grupo'
    },
    partyInfo: {
      level: 'Lvl.'
    },
    runeLister: {
      message: 'Obtención {quantity} {runeName}'
    },
    zaapSearchFilter: {
      placeholder: 'Busca un zaap',
      placeholderZaapi: 'Encuentra un zaapi',
      placeholderPrisme: 'Encontrar un prisma'
    }
  }
}

export default es
