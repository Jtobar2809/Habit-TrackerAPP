-- =====================================================================
--  Habit Tracker - Datos de ejemplo (opcional)
--  Archivo: 002_seed.sql
-- =====================================================================

INSERT INTO Users (Name, Email, CreatedAt) VALUES
    ('Jonathan Tobar', 'jtobar@unimayor.edu.co', datetime('now')),
    ('Demo User',      'demo@habit.dev',         datetime('now'));

INSERT INTO Habitos (Nombre, Descripcion, Activo, IdUsuario, FechaCreacion) VALUES
    ('Leer 20 minutos',     'Lectura diaria antes de dormir', 1, 1, datetime('now')),
    ('Meditar',             'Sesión guiada de 10 minutos',    1, 1, datetime('now')),
    ('Ejercicio',           'Cardio o fuerza 30 min',         1, 1, datetime('now')),
    ('Beber 2L de agua',    'Repartido durante el día',       0, 1, datetime('now')),
    ('Aprender React',      'Construir el frontend',          1, 2, datetime('now'));

INSERT INTO RegistrosHabitos (IdHabito, Fecha, Cumplido) VALUES
    (1, date('now', '-2 day'), 1),
    (1, date('now', '-1 day'), 1),
    (1, date('now'),           1),
    (2, date('now', '-1 day'), 1),
    (2, date('now'),           0),
    (3, date('now'),           1);

INSERT INTO EstadisticasHabitos (IdHabito, DiasCumplidos, RachaActual, Porcentaje) VALUES
    (1, 3, 3, 100.0),
    (2, 1, 0, 50.0),
    (3, 1, 1, 100.0);
