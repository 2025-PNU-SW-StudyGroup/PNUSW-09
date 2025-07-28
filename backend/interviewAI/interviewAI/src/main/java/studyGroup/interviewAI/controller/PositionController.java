package studyGroup.interviewAI.controller;

import org.springframework.web.bind.annotation.*;
import studyGroup.interviewAI.entity.Position;
import studyGroup.interviewAI.service.PositionService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/positions")
public class PositionController {
    private final PositionService positionService;

    public PositionController(PositionService positionService) {
        this.positionService = positionService;
    }

    @GetMapping
    public List<Position> getAllPositions() {
        return positionService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Position> getPosition(@PathVariable Long id) {
        return positionService.findById(id);
    }

    @PostMapping
    public Position createPosition(@RequestBody Position position) {
        return positionService.save(position);
    }

    @PutMapping("/{id}")
    public Position updatePosition(@PathVariable Long id, @RequestBody Position position) {
        position.setId(id);
        return positionService.save(position);
    }

    @DeleteMapping("/{id}")
    public void deletePosition(@PathVariable Long id) {
        positionService.deleteById(id);
    }
} 