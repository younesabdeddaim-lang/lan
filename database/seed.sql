-- ============================================================
-- DONNÉES INITIALES (SEED) : GESTION CENTRE DEUXIÈME CHANCE
-- ============================================================

INSERT INTO centres (id, nom, slogan, adresse, ville, telephone, email, directeur, port_serveur)
VALUES (
    'CENTRE-01',
    'Centre Deuxième Chance - Espoir & Avenir',
    'Insertion, Formation et Accompagnement Professionnel',
    '12 Avenue de l''Éducation et du Travail',
    'Casablanca',
    '+212 5 22 00 11 22',
    'contact@centre-deuxieme-chance.ma',
    'M. Khalid Amrani',
    3000
) ON CONFLICT (id) DO NOTHING;

INSERT INTO utilisateurs (id, nom, prenom, email, mot_de_passe, role, actif)
VALUES
('usr-admin-1', 'Benali', 'Samir', 'admin@centre.local', 'admin123', 'Administrateur', true),
('usr-dir-1', 'Amrani', 'Khalid', 'directeur@centre.local', 'directeur123', 'Directeur', true),
('usr-gest-1', 'Tazi', 'Fatima', 'gestion@centre.local', 'gestion123', 'Gestionnaire', true),
('usr-educ-1', 'El Idrissi', 'Yassine', 'educateur@centre.local', 'educ123', 'Éducateur', true),
('usr-form-1', 'Bouzid', 'Amina', 'formateur@centre.local', 'format123', 'Formateur', true)
ON CONFLICT (id) DO NOTHING;
