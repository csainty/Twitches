[assembly: WebActivator.PreApplicationStartMethod(typeof(Twitches.App_Start.Combres), "PreStart")]

namespace Twitches.App_Start
{
    using System.Web.Routing;
    using global::Combres;

    public static class Combres
    {
        public static void PreStart()
        {
            RouteTable.Routes.AddCombresRoute("Combres");
        }
    }
}