-- =====================================================================
--  Habit Tracker - Migración inicial (SQLite)
--  Archivo: 001_init.sql
--  Objetivo: crear las tablas que consumen los repositorios Dapper.
--  Compatible con la cadena de conexión:
--     Data Source=..\HabitTrackerApp.Core\Data\todo.db
-- =====================================================================

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------
--  Users
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Users (
    Id        INTEGER PRIMARY KEY AUTOINCREMENT,
    Name      TEXT    NOT NULL,
    Email     TEXT    NOT NULL UNIQUE,
    CreatedAt TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS IX_Users_Email ON Users(Email);

-- ---------------------------------------------------------------------
--  Habitos
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Habitos (
    Id            INTEGER PRIMARY KEY AUTOINCREMENT,
    Nombre        TEXT    NOT NULL,
    Descripcion   TEXT    NOT NULL DEFAULT '',
    Activo        INTEGER NOT NULL DEFAULT 1,
    IdUsuario     INTEGER NOT NULL,
    FechaCreacion TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (IdUsuario) REFERENCES Users(Id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS IX_Habitos_IdUsuario ON Habitos(IdUsuario);
CREATE INDEX IF NOT EXISTS IX_Habitos_Activo    ON Habitos(Activo);

-- ---------------------------------------------------------------------
--  RegistrosHabitos
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS RegistrosHabitos (
    Id        INTEGER PRIMARY KEY AUTOINCREMENT,
    IdHabito  INTEGER NOT NULL,
    Fecha     TEXT    NOT NULL,
    Cumplido  INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (IdHabito) REFERENCES Habitos(Id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS IX_RegistrosHabitos_IdHabito ON RegistrosHabitos(IdHabito);
CREATE INDEX IF NOT EXISTS IX_RegistrosHabitos_Fecha    ON RegistrosHabitos(Fecha);

-- ---------------------------------------------------------------------
--  EstadisticasHabitos
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS EstadisticasHabitos (
    Id             INTEGER PRIMARY KEY AUTOINCREMENT,
    IdHabito       INTEGER NOT NULL,
    DiasCumplidos  INTEGER NOT NULL DEFAULT 0,
    RachaActual    INTEGER NOT NULL DEFAULT 0,
    Porcentaje     REAL    NOT NULL DEFAULT 0,
    FOREIGN KEY (IdHabito) REFERENCES Habitos(Id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS IX_EstadisticasHabitos_IdHabito ON EstadisticasHabitos(IdHabito);
