# Déployer l’application avec Dokploy

Ce guide décrit un déploiement avec un seul domaine public. Dokploy expose le frontend, et Nginx relaie les requêtes `/api` vers FastAPI. PostgreSQL reste privé et ses données sont conservées dans un volume.

## 1. Préparer le dépôt

1. Pousser le dépôt sur GitHub, GitLab ou une forge accessible par Dokploy.
2. Vérifier que les fichiers suivants sont présents à la racine :
   - `compose.production.yml`
   - `frontend/Dockerfile`
   - `frontend/nginx.conf`
   - `backend/Dockerfile`
3. Copier `.env.production.example` dans un gestionnaire de mots de passe ou dans Dokploy. Ne pas committer le fichier contenant le vrai mot de passe.

## 2. Créer l’application dans Dokploy

1. Créer un nouveau projet dans Dokploy.
2. Ajouter une application de type **Docker Compose**.
3. Sélectionner le dépôt et la branche à déployer.
4. Indiquer `compose.production.yml` comme fichier Compose.
5. Ajouter les variables d’environnement suivantes dans Dokploy :
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DB`
   - `APP_NAME`
   - `APP_VERSION`
   - `PUBLIC_URL`
   - `LOG_LEVEL`
   - `PAGINATION_DEFAULT_PAGE_SIZE`

`PUBLIC_URL` doit contenir l’URL publique complète, par exemple `https://app.exemple.fr`.

## 3. Configurer le domaine

1. Dans le service `frontend`, ajouter le domaine public, par exemple `app.exemple.fr`.
2. Faire pointer le DNS du domaine vers l’adresse IP du VPS.
3. Activer le certificat HTTPS géré par Dokploy.
4. Déployer l’application.

Seul le service `frontend` est exposé. PostgreSQL et FastAPI communiquent via le réseau Docker interne.

## 4. Vérifier le déploiement

Depuis un navigateur ou un terminal :

```text
https://app.exemple.fr/
https://app.exemple.fr/parametres
https://app.exemple.fr/profil
https://app.exemple.fr/a-propos
https://app.exemple.fr/api/health
```

Les quatre premières URLs doivent afficher l’application, y compris après un rechargement direct. `/api/health` doit répondre avec un statut HTTP 200.

Dans Dokploy, vérifier également que les trois services sont `healthy` et consulter les logs du backend en cas de problème.

## 5. Appliquer les migrations

Les migrations ne sont pas lancées automatiquement au démarrage. Après le premier déploiement, ouvrir un shell dans le conteneur `backend` depuis Dokploy et exécuter :

```bash
alembic upgrade head
```

Répéter cette commande après chaque déploiement qui ajoute une migration.

## 6. Sauvegardes et mises à jour

- Configurer des sauvegardes régulières du volume PostgreSQL ou utiliser les sauvegardes Dokploy.
- Tester périodiquement la restauration d’une sauvegarde.
- Ne jamais supprimer le volume `db_data` lors d’une mise à jour.
- Pour déployer une nouvelle version, pousser les changements puis relancer le déploiement Dokploy.
- En cas de problème, consulter les logs puis revenir au commit précédent.

## Dépannage rapide

- **404 après rechargement d’une page** : vérifier que le trafic arrive bien sur le service frontend et que `try_files` est présent dans `frontend/nginx.conf`.
- **Indicateur serveur déconnecté** : vérifier `/api/health`, l’état du backend et les logs Nginx.
- **Backend qui ne démarre pas** : vérifier `POSTGRES_*`, la connexion générée vers le service `db` et le healthcheck PostgreSQL.
- **Erreur de migration** : vérifier que PostgreSQL est healthy avant d’exécuter `alembic upgrade head`.
