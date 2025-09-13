import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dataService, type Spot, type Activity, type TripSpot, type Trip } from '@/services/dataService';
import { X, Copy, Edit, Eye } from 'lucide-react';

interface AlertState {
  show: boolean;
  title: string;
  message: string;
  variant: 'default' | 'destructive';
}

export function ItineraryPlanner() {
  const spots: Spot[] = dataService.getSpots();
  const [selectedSpots, setSelectedSpots] = useState<TripSpot[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tripName, setTripName] = useState('');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [alert, setAlert] = useState<AlertState>({ show: false, title: '', message: '', variant: 'default' });
  const [editingTripId, setEditingTripId] = useState<number | null>(null);
  const [viewingTrip, setViewingTrip] = useState<Trip | null>(null);

  // Filter spots based on search term
  const filteredSpots = spots.filter(
    (spot) =>
      spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add a spot to the itinerary
  const addSpot = (spot: Spot) => {
    if (!selectedSpots.some((s) => s.id === spot.id)) {
      setSelectedSpots([...selectedSpots, { ...spot, selectedActivities: [] }]);
    }
  };

  // Remove a spot from the itinerary
  const removeSpot = (spotId: number) => {
    setSelectedSpots(selectedSpots.filter((s) => s.id !== spotId));
  };

  // Toggle activity selection for a spot
  const toggleActivity = (spotId: number, activity: Activity) => {
    setSelectedSpots((prev) =>
      prev.map((spot) =>
        spot.id === spotId
          ? {
              ...spot,
              selectedActivities: spot.selectedActivities.some((a) => a.name === activity.name)
                ? spot.selectedActivities.filter((a) => a.name !== activity.name)
                : [...spot.selectedActivities, activity],
            }
          : spot
      )
    );
  };

  // Calculate total cost including activities for a trip or selected spots
  const calculateTotalCost = (spots: TripSpot[]) =>
    spots.reduce(
      (sum, spot) =>
        sum +
        spot.cost.entry +
        spot.cost.transport +
        spot.cost.accommodation +
        spot.selectedActivities.reduce((acc, act) => acc + act.estimatedCost, 0),
      0
    );

  // Save the trip (new or edited)
  const saveTrip = () => {
    if (!tripName) {
      setAlert({
        show: true,
        title: 'Error',
        message: 'Please enter a trip name.',
        variant: 'destructive',
      });
      return;
    }
    if (selectedSpots.length === 0) {
      setAlert({
        show: true,
        title: 'Error',
        message: 'Please add at least one spot to the itinerary.',
        variant: 'destructive',
      });
      return;
    }
    const newTrip: Trip = {
      id: editingTripId || trips.length + 1,
      name: tripName,
      spots: selectedSpots,
    };
    if (editingTripId) {
      // Update existing trip
      setTrips(trips.map((trip) => (trip.id === editingTripId ? newTrip : trip)));
      setAlert({
        show: true,
        title: 'Success',
        message: `Trip "${tripName}" updated successfully!`,
        variant: 'default',
      });
    } else {
      // Save new trip
      setTrips([...trips, newTrip]);
      setAlert({
        show: true,
        title: 'Success',
        message: `Trip "${tripName}" saved successfully!`,
        variant: 'default',
      });
    }
    dataService.saveTrip(newTrip);
    resetForm();
  };

  // Reset form for new trip
  const resetForm = () => {
    setSelectedSpots([]);
    setTripName('');
    setEditingTripId(null);
    setViewingTrip(null);
  };

  // Clone a trip
  const cloneTrip = (trip: Trip) => {
    setSelectedSpots([...trip.spots]);
    setTripName(`${trip.name} (Copy)`);
    setEditingTripId(null);
    setViewingTrip(null);
    setAlert({
      show: true,
      title: 'Success',
      message: `Trip "${trip.name}" cloned. Please edit the name and save as a new trip.`,
      variant: 'default',
    });
  };

  // Edit a trip
  const editTrip = (trip: Trip) => {
    setSelectedSpots([...trip.spots]);
    setTripName(trip.name);
    setEditingTripId(trip.id);
    setViewingTrip(null);
  };

  // View a trip
  const viewTrip = (trip: Trip) => {
    setViewingTrip(trip);
    setEditingTripId(null);
  };

  // Close alert
  const closeAlert = () => {
    setAlert({ show: false, title: '', message: '', variant: 'default' });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card className="bg-card text-card-foreground mb-6">
        <CardHeader>
          <CardTitle>{editingTripId ? 'Edit Trip' : 'Create Your Trip'}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Alert for feedback */}
          {alert.show && (
            <Alert variant={alert.variant} className="mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <AlertTitle>{alert.title}</AlertTitle>
                  <AlertDescription>{alert.message}</AlertDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={closeAlert}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Alert>
          )}

          {/* Trip Name Input and Actions */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="tripName">Trip Name</Label>
              <Button variant="outline" onClick={resetForm}>
                Create New Trip
              </Button>
            </div>
            <Input
              id="tripName"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              placeholder="Enter your trip name"
              className="mb-2"
            />
            <Button onClick={saveTrip} className="w-full">
              {editingTripId ? 'Update Trip' : 'Save Trip'}
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <Label htmlFor="search">Search Locations</Label>
            <Input
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or category"
            />
          </div>

          {/* Selected Spots */}
          <h3 className="text-lg font-semibold mb-2">
            Selected Spots (Total Cost: {calculateTotalCost(selectedSpots)} ZAR)
          </h3>
          {selectedSpots.length === 0 ? (
            <p className="text-muted-foreground">No spots selected. Add some below!</p>
          ) : (
            <ul className="space-y-4 mb-4">
              {selectedSpots.map((spot) => (
                <li key={spot.id} className="bg-accent p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {spot.name} - {spot.category} (Base Cost: {spot.cost.entry + spot.cost.transport + spot.cost.accommodation} ZAR)
                    </span>
                    <Button variant="destructive" size="sm" onClick={() => removeSpot(spot.id)}>
                      Remove
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{spot.description}</p>
                  {/* Activity Selection */}
                  <div className="mt-2">
                    <h4 className="text-sm font-semibold">Select Activities</h4>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {dataService.getActivities(spot.id).map((activity) => (
                        <Button
                          key={activity.name}
                          variant={spot.selectedActivities.some((a) => a.name === activity.name) ? 'default' : 'outline'}
                          onClick={() => toggleActivity(spot.id, activity)}
                          className="justify-start text-left"
                        >
                          {activity.name} ({activity.estimatedCost} ZAR)
                        </Button>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Available Spots */}
          <h3 className="text-lg font-semibold mb-2">Available Spots</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredSpots.map((spot) => (
              <Button
                key={spot.id}
                onClick={() => addSpot(spot)}
                variant="outline"
                className="justify-start"
                disabled={selectedSpots.some((s) => s.id === spot.id)}
              >
                {spot.name} ({spot.category})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Previous Trips Table */}
      {trips.length > 0 && (
        <Card className="bg-card text-card-foreground mb-6">
          <CardHeader>
            <CardTitle>Previous Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trip Name</TableHead>
                  <TableHead>Spots</TableHead>
                  <TableHead>Total Cost (ZAR)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell>{trip.name}</TableCell>
                    <TableCell>{trip.spots.length}</TableCell>
                    <TableCell>{calculateTotalCost(trip.spots)}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cloneTrip(trip)}
                        title="Clone Trip"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editTrip(trip)}
                        title="Edit Trip"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewTrip(trip)}
                        title="View Trip"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* View Trip Details */}
      {viewingTrip && (
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Viewing Trip: {viewingTrip.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {viewingTrip.spots.map((spot) => (
                <li key={spot.id} className="bg-accent p-4 rounded-lg">
                  <div className="font-medium">
                    {spot.name} - {spot.category} (Base Cost: {spot.cost.entry + spot.cost.transport + spot.cost.accommodation} ZAR)
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{spot.description}</p>
                  <div className="mt-2">
                    <h4 className="text-sm font-semibold">Selected Activities</h4>
                    <ul className="text-sm text-muted-foreground mt-1">
                      {spot.selectedActivities.length > 0 ? (
                        spot.selectedActivities.map((activity) => (
                          <li key={activity.name}>
                            {activity.name} ({activity.estimatedCost} ZAR)
                          </li>
                        ))
                      ) : (
                        <li>No activities selected</li>
                      )}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="mt-4" onClick={() => setViewingTrip(null)}>
              Close
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
