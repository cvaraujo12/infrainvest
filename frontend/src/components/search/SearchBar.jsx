"use client";

import { useState, useEffect } from "react";
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countrySearchEngines, defaultCountry, detectUserCountry } from "@/lib/search-engines";
import { Search, Globe } from "lucide-react";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState(defaultCountry);
  const [selectedEngine, setSelectedEngine] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    // Load search preferences from localStorage
    const savedCountry = localStorage.getItem("preferredCountry");
    const savedEngine = localStorage.getItem("preferredEngine");
    const savedHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");

    if (savedCountry) setCountry(savedCountry);
    else {
      const detectedCountry = detectUserCountry();
      setCountry(detectedCountry);
      localStorage.setItem("preferredCountry", detectedCountry);
    }

    if (savedEngine) setSelectedEngine(savedEngine);
    else {
      const defaultEngine = countrySearchEngines[country].engines[0].id;
      setSelectedEngine(defaultEngine);
      localStorage.setItem("preferredEngine", defaultEngine);
    }

    setSearchHistory(savedHistory);
  }, []);

  const handleSearch = (engineId) => {
    if (!query.trim()) return;

    const searchUrl = getSearchUrl(engineId || selectedEngine, query);
    
    // Update search history
    const newHistory = [{ query, engine: engineId || selectedEngine, timestamp: Date.now() }, 
      ...searchHistory.slice(0, 9)];
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));

    // Open search in new tab
    window.open(searchUrl, "_blank");
    setOpen(false);
  };

  const handleCountryChange = (value) => {
    setCountry(value);
    localStorage.setItem("preferredCountry", value);
    // Reset selected engine to first engine of new country
    const defaultEngine = countrySearchEngines[value].engines[0].id;
    setSelectedEngine(defaultEngine);
    localStorage.setItem("preferredEngine", defaultEngine);
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-full max-w-sm justify-start text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search infrastructure projects...
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[850px]">
          <DialogHeader>
            <DialogTitle>Search Infrastructure Projects</DialogTitle>
          </DialogHeader>
          
          <div className="flex gap-2 mb-4">
            <Select value={country} onValueChange={handleCountryChange}>
              <SelectTrigger className="w-[180px]">
                <Globe className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(countrySearchEngines).map(([code, data]) => (
                  <SelectItem key={code} value={code}>
                    {data.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Command>
            <CommandInput
              placeholder="Type your search query..."
              value={query}
              onValueChange={setQuery}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <CommandList>
              <CommandGroup heading="Search Engines">
                {countrySearchEngines[country].engines.map((engine) => (
                  <CommandItem
                    key={engine.id}
                    onSelect={() => handleSearch(engine.id)}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    {engine.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              {searchHistory.length > 0 && (
                <CommandGroup heading="Recent Searches">
                  {searchHistory.map((item, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => {
                        setQuery(item.query);
                        handleSearch(item.engine);
                      }}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      {item.query}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}