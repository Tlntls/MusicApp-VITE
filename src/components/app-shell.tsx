"use client";

import * as React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Library, Search, Music, Sparkles, Waves, PanelLeft, Users, ListMusic, ImageOff, BookOpen, FolderPlus, RefreshCw, Trash2, RefreshCw as RefreshIcon, Folder, ChevronLeft, ChevronRight } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, useSidebar } from './ui/sidebar';
import { Player } from './player';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet';
import { useMusic } from '../context/MusicContext'; // This import is crucial for the button functions
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './ui/tooltip';

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

function AppShellContent() {
  const location = useLocation();
  const pathname = location.pathname;
  const { isMobile, state, toggleSidebar } = useSidebar();
  const showPlayer = pathname !== '/player';
  const { songs, fetchSongs: handleScanDbClick, startFolderScan: handleAddFolderClick, folders, removeFolder, rescanFolder, isLoading } = useMusic();
  const [folderDialogOpen, setFolderDialogOpen] = React.useState(false);

  // Extract unique artists for collapsed sidebar
  const uniqueArtistsMap = React.useMemo(() => {
    const map = new Map();
    songs.forEach(song => {
      if (!song.artist?.id || !song.artist?.name) return;
      if (!map.has(song.artist.id)) {
        map.set(song.artist.id, {
          id: song.artist.id,
          name: song.artist.name,
          coverArtPath: song.album?.cover || '/placeholder-cover.png',
        });
      } else if (!map.get(song.artist.id).coverArtPath && song.album?.cover) {
        map.get(song.artist.id).coverArtPath = song.album.cover;
      }
    });
    return map;
  }, [songs]);
  const artists = React.useMemo(() => {
    const arr = Array.from(uniqueArtistsMap.values());
    arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [uniqueArtistsMap]);

  // Determine if we are on the Artists page
  const isArtistsPage = pathname.startsWith('/artists');

  // Remove the collapsedArtistList logic and always use the normal sidebarContent
  const sidebarContent = (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg font-headline">
            <Waves className="w-6 h-6 text-primary" />
            {state === 'expanded' && <span>LoseAmp</span>}
          </Link>
          {/* Always show the toggle button; icon direction depends on state */}
          <button
            type="button"
            aria-label={state === 'expanded' ? 'Collapse sidebar' : 'Expand sidebar'}
            onClick={toggleSidebar}
            className="hidden md:inline-flex items-center justify-center p-1 rounded hover:bg-accent/20 transition-colors"
            style={{ marginLeft: 4 }}
          >
            {state === 'expanded' ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <TooltipProvider delayDuration={0}>
        {navGroups.map((group) => (
            <SidebarMenu key={group.title}>
                {state === 'expanded' && (
                  <p className="px-4 pt-4 pb-2 text-xs font-semibold text-muted-foreground">{group.title}</p>
                )}
                {group.items.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      {item.label === 'Artists' ? (
                        <Link to={item.href} className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                          <item.icon />
                          {state === 'expanded' && <span>{item.label}</span>}
                        </Link>
                      ) : (
                        state === 'collapsed' ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                                <Link to={item.href}>
                                  <item.icon />
                                </Link>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            <TooltipContent side="right">{item.label}</TooltipContent>
                          </Tooltip>
                        ) : (
                          <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                            <Link to={item.href}>
                              <item.icon />
                              <span>{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        )
                      )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        ))}
        </TooltipProvider>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <div className="flex flex-col gap-1 p-1">
          <TooltipProvider delayDuration={0}>
            {state === 'collapsed' ? (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" className="w-full justify-center bg-surface-bg text-text-light border-none hover:bg-accent-purple/20 text-xs py-1" onClick={handleScanDbClick}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Scan DB</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" className="w-full justify-center bg-surface-bg text-text-light border-none hover:bg-accent-purple/20 text-xs py-1" onClick={handleAddFolderClick}>
                      <FolderPlus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Add Folder</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" className="w-full justify-center mt-1 bg-surface-bg text-text-light border-none hover:bg-accent-purple/20 text-xs py-1" onClick={() => setFolderDialogOpen(true)}>
                      <Folder className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Manage Folders</TooltipContent>
                </Tooltip>
              </>
            ) : (
              <>
                <Button size="sm" className="w-full justify-start bg-surface-bg text-text-light border-none hover:bg-accent-purple/20 text-xs py-1" onClick={handleScanDbClick}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Scan DB
                </Button>
                <Button size="sm" className="w-full justify-start bg-surface-bg text-text-light border-none hover:bg-accent-purple/20 text-xs py-1" onClick={handleAddFolderClick}>
                  <FolderPlus className="mr-2 h-4 w-4" /> Add Folder
                </Button>
                <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="w-full justify-start mt-1 bg-surface-bg text-text-light border-none hover:bg-accent-purple/20 text-xs py-1">
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
              </>
            )}
          </TooltipProvider>
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
        <main className="flex-1 overflow-y-auto">{<Outlet />}</main>
        {showPlayer && <Player />}
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-main-bg w-full">
        <Sidebar variant="sidebar" className="border-r z-20 bg-surface-bg text-text-light w-36 min-w-[7rem] max-w-[10rem] h-full flex flex-col">
          <SidebarHeader className="p-1 pb-0">
            <div className="flex items-center gap-1 justify-between">
              <Link to="/" className="flex items-center gap-1 font-bold text-base font-headline">
                <Waves className="w-5 h-5 text-primary" />
                {state === 'expanded' && <span>LoseAmp</span>}
              </Link>
              <button
                type="button"
                aria-label={state === 'expanded' ? 'Collapse sidebar' : 'Expand sidebar'}
                onClick={toggleSidebar}
                className="hidden md:inline-flex items-center justify-center p-1 rounded hover:bg-accent/20 transition-colors"
                style={{ marginLeft: 2 }}
              >
                {state === 'expanded' ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-1 flex-1 min-h-0">
            <TooltipProvider delayDuration={0}>
              {navGroups.map((group) => (
                <SidebarMenu key={group.title} className="mb-1">
                  {state === 'expanded' && (
                    <p className="px-2 pt-2 pb-1 text-xs font-semibold text-muted-foreground">{group.title}</p>
                  )}
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      {item.label === 'Artists' ? (
                        <Link to={item.href} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-xs">
                          <item.icon className="w-4 h-4" />
                          {state === 'expanded' && <span>{item.label}</span>}
                        </Link>
                      ) : (
                        state === 'collapsed' ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label} size="sm">
                                <Link to={item.href}>
                                  <item.icon className="w-4 h-4" />
                                </Link>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            <TooltipContent side="right">{item.label}</TooltipContent>
                          </Tooltip>
                        ) : (
                          <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label} size="sm">
                            <Link to={item.href}>
                              <item.icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        )
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              ))}
            </TooltipProvider>
          </SidebarContent>
          <SidebarFooter className="mt-0 pb-0">
            <div className="flex flex-col gap-1 p-1">
              <TooltipProvider delayDuration={0}>
                {state === 'collapsed' ? (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" className="w-full justify-center bg-surface-bg text-text-light border-none hover:bg-accent-purple/20 text-xs py-1" onClick={handleScanDbClick}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">Scan DB</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" className="w-full justify-center bg-surface-bg text-text-light border-none hover:bg-accent-purple/20 text-xs py-1" onClick={handleAddFolderClick}>
                          <FolderPlus className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">Add Folder</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" className="w-full justify-center mt-1 bg-surface-bg text-text-light border-none hover:bg-accent-purple/20 text-xs py-1" onClick={() => setFolderDialogOpen(true)}>
                          <Folder className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">Manage Folders</TooltipContent>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Button size="sm" className="w-full justify-start bg-surface-bg text-text-light border-none hover:bg-accent-purple/20 text-xs py-1" onClick={handleScanDbClick}>
                      <RefreshCw className="mr-2 h-4 w-4" /> Scan DB
                    </Button>
                    <Button size="sm" className="w-full justify-start bg-surface-bg text-text-light border-none hover:bg-accent-purple/20 text-xs py-1" onClick={handleAddFolderClick}>
                      <FolderPlus className="mr-2 h-4 w-4" /> Add Folder
                    </Button>
                    <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="w-full justify-start mt-1 bg-surface-bg text-text-light border-none hover:bg-accent-purple/20 text-xs py-1">
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
                  </>
                )}
              </TooltipProvider>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1 w-full bg-main-bg text-text-light h-full min-h-0">
          <main
            className="flex-1 w-full overflow-y-auto min-h-0"
            style={{ paddingBottom: showPlayer ? 0 : 0 }}
          >
            <Outlet />
          </main>
        </div>
      </div>
      {showPlayer && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <Player />
        </div>
      )}
    </>
  );
}

// This is the main component that this file exports for layout.tsx to use
export default function AppShell() {
  return (
    <SidebarProvider>
      <AppShellContent />
    </SidebarProvider>
  );
}