"use client";

import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Library, Search, Music, Sparkles, Waves, PanelLeft, Users, ListMusic, ImageOff, BookOpen, FolderPlus, RefreshCw, Trash2, RefreshCw as RefreshIcon, Folder } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, useSidebar } from './ui/sidebar';
import { Player } from './player';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet';
import { useMusic } from '../context/MusicContext'; // This import is crucial for the button functions
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';

const navGroups = [
  {
    title: "Library",
    items: [
      { href: '/artists', label: 'Artists', icon: Users },
      { href: '/albums', label: 'Albums', icon: Library },
      { href: '/songs', label: 'Songs', icon: Music },
      { href: '/playlists', label: 'Playlists', icon: ListMusic },
      { href: '/audiobooks', label: 'Audiobooks', icon: BookOpen },
    ],
  },
  {
    title: "Discover",
    items: [
      { href: '/search', label: 'Search', icon: Search },
    ]
  }
];

function AppShellContent({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pathname = location.pathname;
  const { isMobile } = useSidebar();
  const showPlayer = pathname !== '/player';

  // Get the functions from our central context!
  const { fetchSongs: handleScanDbClick, startFolderScan: handleAddFolderClick, folders, removeFolder, rescanFolder } = useMusic();
  const [folderDialogOpen, setFolderDialogOpen] = React.useState(false);

  const sidebarContent = (
    <>
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 font-bold text-lg font-headline">
          <Waves className="w-6 h-6 text-primary" />
          <span>LoseAmp</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        {navGroups.map((group) => (
            <SidebarMenu key={group.title}>
                <p className="px-4 pt-4 pb-2 text-xs font-semibold text-muted-foreground">{group.title}</p>
                {group.items.map((item) => (
                    <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                        <Link to={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        ))}
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <div className="flex flex-col gap-2 p-2">
          {/* This button now correctly calls the fetchSongs function from our context */}
          <Button variant="outline" className="w-full justify-start" onClick={handleScanDbClick}>
            <RefreshCw className="mr-2 h-4 w-4" /> Scan DB
          </Button>
          {/* This button now correctly calls the startFolderScan function from our context */}
          <Button variant="outline" className="w-full justify-start" onClick={handleAddFolderClick}>
            <FolderPlus className="mr-2 h-4 w-4" /> Add Folder
          </Button>
          <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start mt-2">
                <Folder className="mr-2 h-4 w-4" /> Manage Folders
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Library Folders</DialogTitle>
                <DialogDescription>Manage your watched music folders. Remove or rescan as needed.</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {folders.length === 0 && <div className="text-muted-foreground">No folders added yet.</div>}
                {folders.map(folder => (
                  <div key={folder} className="flex items-center justify-between border rounded px-2 py-1 bg-muted/30">
                    <span className="truncate text-xs" title={folder}>{folder}</span>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" title="Rescan" onClick={() => rescanFolder(folder)}><RefreshIcon className="h-4 w-4" /></Button>
                      <Button size="icon" variant="destructive" title="Remove" onClick={() => removeFolder(folder)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarFooter>
    </>
  );

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen">
        <header className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg font-headline">
            <Waves className="w-6 h-6 text-primary" />
            <span>LoseAmp</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <PanelLeft className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 flex flex-col bg-background">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">A list of links to navigate the application.</SheetDescription>
              {sidebarContent}
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
        {showPlayer && <Player />}
      </div>
    );
  }

  return (
      <div className="flex h-screen">
        <Sidebar variant="sidebar" className="border-r">
          {sidebarContent}
        </Sidebar>
        <div className="flex flex-col flex-1">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
          {showPlayer && <Player />}
        </div>
      </div>
  );
}

// This is the main component that this file exports for layout.tsx to use
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppShellContent>{children}</AppShellContent>
    </SidebarProvider>
  );
}