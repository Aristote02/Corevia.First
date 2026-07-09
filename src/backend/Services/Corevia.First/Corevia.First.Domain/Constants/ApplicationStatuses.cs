namespace Corevia.First.Domain.Constants;

public static class ApplicationStatuses
{
    public static class User
    {
        public const string Nouveau = "nouveau";
        public const string EnCours = "en_cours";
        public const string Cloture = "cloture";
    }

    public static class Admin
    {
        public const string Nouveau = "nouveau";
        public const string PasDeReponse = "pas_de_reponse";
        public const string AttenteDocuments = "attente_documents";
        public const string DocumentsEnvoyes = "documents_envoyes";
        public const string AttenteUniversite = "attente_universite";
        public const string Invitation = "invitation";
        public const string PreparationVoyage = "preparation_voyage";
        public const string ArriveFinalise = "arrive_finalise";
    }

    public static string SyncUserStatusFromAdmin(string adminStatus) => adminStatus switch
    {
        Admin.Nouveau => User.Nouveau,
        Admin.ArriveFinalise => User.Cloture,
        _ => User.EnCours,
    };
}
