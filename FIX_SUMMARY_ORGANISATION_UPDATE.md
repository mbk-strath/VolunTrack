# Fix: Unknown column 'total_volunteers' Error in Organisation Update

## Problem

When updating an organisation membership, the system was throwing a SQL error:

```
SQLSTATE[42S22]: Column not found: 1054 Unknown column 'total_volunteers' in 'field list'
SQL: update organisations set org_name = Bamburi, country = Kenya, city = Nairobi,
total_volunteers = 0, opportunities = 0, organisations.updated_at = 2025-11-17 09:19:47 where id = 1
```

## Root Cause

The issue was in the application architecture:

1. **MembershipService.php** was dynamically adding `total_volunteers` and `opportunities` attributes to organisation objects
2. These are **computed values** (not stored in the database) that should only be calculated on-the-fly
3. When the frontend echoed back the response, these fields were included in the request body
4. The MembershipController's `update()` method was validating all incoming fields without filtering out the computed ones
5. Eloquent's `update()` method was trying to save these non-existent columns to the database

## Solution

Implemented the proper Laravel pattern for computed attributes using **Eloquent Accessors** and **`$appends`**:

### Changes Made:

#### 1. **app/Models/Organisation.php**

- Added `$appends` array with `['total_volunteers', 'opportunities_count']`
- Created getter accessors:
  - `getTotalVolunteersAttribute()` - computes via `uniqueVolunteerCount()`
  - `getOpportunitiesCountAttribute()` - computes via `opportunities()->count()`
- These attributes are now **read-only** and **never stored** in the database

#### 2. **app/Services/MembershipService.php**

- Removed manual attribute assignment
- The computed attributes are now automatically included in JSON responses via Eloquent's `$appends`

### How It Works:

```php
// When an organisation is retrieved:
$org = Organisation::find(1);

// These are automatically computed and included in responses:
echo $org->total_volunteers;      // Computed dynamically
echo $org->opportunities_count;   // Computed dynamically

// But when updating:
$org->update(['org_name' => 'New Name']); // ✅ No error!
// total_volunteers and opportunities_count are NOT in fillable,
// so they won't be included in the SQL UPDATE statement
```

### Benefits:

1. ✅ Computed attributes are automatically included in JSON responses
2. ✅ They cannot be accidentally saved to the database
3. ✅ Values are always fresh (no stale cached values)
4. ✅ Follows Laravel best practices
5. ✅ Consistent with how Volunteer model already handles computed attributes

### Testing:

All tests pass:

- ✅ Computed attributes included in JSON responses
- ✅ Organisation updates work without errors
- ✅ Fields are not in fillable array
- ✅ Values are calculated correctly

## Files Modified:

1. `/backend/app/Models/Organisation.php` - Added $appends and accessors
2. `/backend/app/Services/MembershipService.php` - Removed manual attribute setting

## Migration Required:

None - this is a code-only fix that doesn't require database changes.
