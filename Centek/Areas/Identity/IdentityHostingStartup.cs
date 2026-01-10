using System;
using Centek.Data;
using Centek.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

[assembly: HostingStartup(typeof(Centek.Areas.Identity.IdentityHostingStartup))]
namespace Centek.Areas.Identity
{
    public class IdentityHostingStartup : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder)
        {
            builder.ConfigureServices((context, services) => {
                services.Configure<IdentityOptions>(options =>
                {
                    options.SignIn.RequireConfirmedEmail = false;
                });
            });
        }
    }
}
